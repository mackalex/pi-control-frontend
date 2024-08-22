import { Colors } from "@/constants/Colors";
import { GestureResponderEvent, PanResponder, PanResponderGestureState, View } from "react-native";
import {
  RelMouseMove,
  getMouseClickEventCommand,
  getMouseMoveEventCommand,
  BROWSER_MOUSE_BUTTON,
  PICTRL_MOUSE_BUTTON,
  PICTRL_MOUSE_CLICK,
} from "@/hooks/protocolBuffer";
import { PiConnectionProps } from "./Connection";
import { Pressable } from "react-native-gesture-handler";
import React from "react";

const browser_to_pictrl_clicks = new Map<
  BROWSER_MOUSE_BUTTON,
  PICTRL_MOUSE_BUTTON
>([
  [BROWSER_MOUSE_BUTTON.MAIN, PICTRL_MOUSE_BUTTON.LEFT],
  [BROWSER_MOUSE_BUTTON.SEC, PICTRL_MOUSE_BUTTON.RIGHT],
]);

type PreviousPointerEvent = {
  panId: string;
  lastMouseDown: number; // Unix millis
  lastMouseUp: number; // Unix millis
  doubleTapped: boolean;
};

const MOUSE_DELAY_FOR_CLICK = 100; // ms
const MOUSE_DOWN_PACKET = getMouseClickEventCommand(
  browser_to_pictrl_clicks.get(BROWSER_MOUSE_BUTTON.MAIN)!,
  PICTRL_MOUSE_CLICK.DOWN,
);
const MOUSE_UP_PACKET = getMouseClickEventCommand(
  browser_to_pictrl_clicks.get(BROWSER_MOUSE_BUTTON.MAIN)!,
  PICTRL_MOUSE_CLICK.UP,
);

export function MousePad({ conn }: PiConnectionProps) {
  let prev: PreviousPointerEvent = {
    panId: "",
    lastMouseDown: 0,
    lastMouseUp: 0,
    doubleTapped: false
  };

  let delta: RelMouseMove = {
    x: 0,
    y: 0,
  };
  const panResponder = React.useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) =>
        true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
        true,

      onPanResponderGrant: (e, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
        if (e.nativeEvent.touches.length != 1) {
          // Work on double fingered taps etc. later
          return;
        }

        // User double tapped
        if (e.nativeEvent.timestamp - prev.lastMouseUp < MOUSE_DELAY_FOR_CLICK) {
          prev.doubleTapped = true;
          conn.send(MOUSE_DOWN_PACKET);
        }
        delta.x = 0;
        delta.y = 0;
        prev.panId = e.nativeEvent.identifier;
        prev.lastMouseDown = e.nativeEvent.timestamp;
      },
      onPanResponderMove: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        if (e.nativeEvent.identifier !== prev.panId) {
          return;
        }
        const newDelta: RelMouseMove = {x: Math.round(gestureState.dx - delta.x), y: Math.round(gestureState.dy - delta.y)};
        const protocolPacket = getMouseMoveEventCommand(newDelta);
        conn.send(protocolPacket);

        delta.x = gestureState.dx;
        delta.y = gestureState.dy;
      },
      onPanResponderTerminationRequest: (evt, gestureState) =>
        true,
      onPanResponderRelease: (e, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        if (e.nativeEvent.identifier !== prev.panId) {
          return;
        }

        if (e.nativeEvent.touches.length != 0) {
          // Work on double fingered taps etc. later
          return;
        }

        if (!prev.doubleTapped && e.nativeEvent.timestamp - prev.lastMouseDown < MOUSE_DELAY_FOR_CLICK) {
          // User tapped once
          conn.send(MOUSE_DOWN_PACKET);
          conn.send(MOUSE_UP_PACKET);
        } else if (prev.doubleTapped) {
          // Otherwise, just send mouse up if user double tapped
          conn.send(MOUSE_UP_PACKET);
          prev.doubleTapped = false;
        }

        prev.panId = "";
        prev.lastMouseUp = e.nativeEvent.timestamp;
      },
    }),
  ).current;

  return (
    <View style={{flex: 1, flexDirection: "column", padding: 10, paddingTop: 30}} {...panResponder.panHandlers}>
      <Pressable
        style={{
          backgroundColor: Colors.dark.background,
          flex: 1,
          borderRadius: 20,
        }}
      ></Pressable>
    </View>
  );
}
