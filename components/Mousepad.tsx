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
import { PressableEvent } from "react-native-gesture-handler/lib/typescript/components/Pressable/PressableProps";
import React from "react";

const browser_to_pictrl_clicks = new Map<
  BROWSER_MOUSE_BUTTON,
  PICTRL_MOUSE_BUTTON
>([
  [BROWSER_MOUSE_BUTTON.MAIN, PICTRL_MOUSE_BUTTON.LEFT],
  [BROWSER_MOUSE_BUTTON.SEC, PICTRL_MOUSE_BUTTON.RIGHT],
]);

type RawMouseCoord = {
  x: number;
  y: number;
};

type PreviousPointerEvent = {
  pressId: number;
  panId: string;
  lastTapPos: RawMouseCoord;
  lastPanPos: RawMouseCoord;
  lastMouseDown: number // Unix millis
};

const MOUSE_DELAY_FOR_CLICK = 200; // ms

export function MousePad({ conn }: PiConnectionProps) {
  let prev: PreviousPointerEvent = {
    pressId: -1,
    panId: "",
    lastTapPos: {
      x: -1,
      y: -1,
    },
    lastPanPos: {
      x: -1,
      y: -1,
    },
    lastMouseDown: 0
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
        prev.lastPanPos.x = e.nativeEvent.locationX;
        prev.lastPanPos.y = e.nativeEvent.locationY;
        prev.panId = e.nativeEvent.identifier;
      },
      onPanResponderMove: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        if (e.nativeEvent.identifier !== prev.panId) {
          return;
        }
        delta.x = e.nativeEvent.locationX - prev.lastPanPos.x;
        delta.y = e.nativeEvent.locationY - prev.lastPanPos.y;
        const protocolPacket = getMouseMoveEventCommand(delta);
        conn.send(protocolPacket);

        prev.lastPanPos.x = e.nativeEvent.locationX;
        prev.lastPanPos.y = e.nativeEvent.locationY;
      },
      onPanResponderTerminationRequest: (evt, gestureState) =>
        true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        prev.lastPanPos.x = -1;
        prev.lastPanPos.y = -1;
        prev.panId = "";
      },
    }),
  ).current;

  return (
    <View style={{flex: 1, flexDirection: "column", padding: 10, paddingTop: 30}} {...panResponder.panHandlers}>
      <Pressable
        onPressIn={(e: PressableEvent) => {
          prev.pressId = e.nativeEvent.identifier;
          prev.lastTapPos.x = e.nativeEvent.locationX;
          prev.lastTapPos.y = e.nativeEvent.locationY;
          if (e.nativeEvent.touches.length != 1) {
            // Work on double fingered taps etc. later
            return;
          }
          prev.lastMouseDown = Date.now();
        }}
        onPressOut={(e: PressableEvent) => {
          if (e.nativeEvent.identifier !== prev.pressId) {
            return;
          }

          if (e.nativeEvent.touches.length != 1) {
            // Work on double fingered taps etc. later
            return;
          }

          if (Date.now() - prev.lastMouseDown < MOUSE_DELAY_FOR_CLICK) {
            const mouseDownPacket = getMouseClickEventCommand(
              browser_to_pictrl_clicks.get(BROWSER_MOUSE_BUTTON.MAIN)!,
              PICTRL_MOUSE_CLICK.DOWN,
            );
            const mouseUpPacket = getMouseClickEventCommand(
              browser_to_pictrl_clicks.get(BROWSER_MOUSE_BUTTON.MAIN)!,
              PICTRL_MOUSE_CLICK.UP,
            );
            conn.send(mouseDownPacket);
            conn.send(mouseUpPacket);
          }

          prev.pressId = -1;
        }}
        style={{
          backgroundColor: Colors.dark.background,
          flex: 1,
          borderRadius: 20,
        }}
      ></Pressable>
    </View>
  );
}
