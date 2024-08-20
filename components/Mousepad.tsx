import { Colors } from "@/constants/Colors";
import { GestureResponderEvent } from "react-native";
import {
  RelMouseMove,
  getMouseClickEventCommand,
  getMouseMoveEventCommand,
  BROWSER_MOUSE_BUTTON,
  PICTRL_MOUSE_BUTTON,
  PICTRL_MOUSE_CLICK,
} from "@/hooks/protocolBuffer";
import { PiConnectionProps } from "./Connection";
import { GestureHandlerRootView, Pressable } from "react-native-gesture-handler";
import { PressableEvent } from "react-native-gesture-handler/lib/typescript/components/Pressable/PressableProps";

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
  id: number;
  lastPos: RawMouseCoord;
  lastMouseDown: number // Unix millis
};

const MOUSE_DELAY_FOR_CLICK = 200; // ms

export function MousePad({ conn }: PiConnectionProps) {
  let prev: PreviousPointerEvent = {
    id: -1,
    lastPos: {
      x: -1,
      y: -1,
    },
    lastMouseDown: 0
  };

  let delta: RelMouseMove = {
    x: 0,
    y: 0,
  };
  return (
    <GestureHandlerRootView style={{flex: 1, flexDirection: "column", padding: 10, paddingTop: 30}}>
      <Pressable
        onStartShouldSetResponder={() => true}
        onPressIn={(e: PressableEvent) => {
          prev.id = e.nativeEvent.identifier;
          prev.lastPos.x = e.nativeEvent.locationX;
          prev.lastPos.y = e.nativeEvent.locationY;
          if (e.nativeEvent.touches.length != 1) {
            // Work on double fingered taps etc. later
            return;
          }
          prev.lastMouseDown = Date.now();
        }}
        onPressOut={(e: PressableEvent) => {
          if (e.nativeEvent.identifier !== prev.id) {
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

          prev.id = -1;
        }}
        onResponderMove={(e: GestureResponderEvent) => {
          console.log(e);
          if (parseInt(e.nativeEvent.identifier) !== prev.id) {
            return;
          }
          delta.x = e.nativeEvent.locationX - prev.lastPos.x;
          delta.y = e.nativeEvent.locationY - prev.lastPos.y;
          const protocolPacket = getMouseMoveEventCommand(delta);
          conn.send(protocolPacket);

          prev.lastPos.x = e.nativeEvent.locationX;
          prev.lastPos.y = e.nativeEvent.locationY;
        }}
        style={{
          backgroundColor: Colors.dark.background,
          flex: 1,
          borderRadius: 20,
        }}
      ></Pressable>
    </GestureHandlerRootView>
  );
}
