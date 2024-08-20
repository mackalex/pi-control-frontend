import { Colors } from "@/constants/Colors";
import { View } from "react-native";
import {
  RelMouseMove,
  getMouseClickEventCommand,
  getMouseMoveEventCommand,
  BROWSER_MOUSE_BUTTON,
  PICTRL_MOUSE_BUTTON,
  PICTRL_MOUSE_CLICK,
} from "@/hooks/protocolBuffer";
import { PiConnectionProps } from "./Connection";

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
    <View
      style={{
        flexDirection: "column",
        flex: 1,
        padding: 10,
        paddingTop: 30,
      }}
    >
      <View
        onContextMenu={(e: PointerEvent) => {
          e.preventDefault();
        }}
        onPointerDown={(e: PointerEvent) => {
          prev.id = e.pointerId;
          prev.lastPos.x = e.screenX;
          prev.lastPos.y = e.screenY;
          let button = e.button as BROWSER_MOUSE_BUTTON;
          if (!browser_to_pictrl_clicks.has(button)) {
            return;
          }
          prev.lastMouseDown = Date.now();
        }}
        onPointerUp={(e: PointerEvent) => {
          if (e.pointerId !== prev.id) {
            return;
          }

          let button = e.button as BROWSER_MOUSE_BUTTON;
          if (!browser_to_pictrl_clicks.has(button)) {
            return;
          }

          if (Date.now() - prev.lastMouseDown < MOUSE_DELAY_FOR_CLICK) {
            const mouseDownPacket = getMouseClickEventCommand(
              browser_to_pictrl_clicks.get(button)!,
              PICTRL_MOUSE_CLICK.DOWN,
            );
            const mouseUpPacket = getMouseClickEventCommand(
              browser_to_pictrl_clicks.get(button)!,
              PICTRL_MOUSE_CLICK.UP,
            );
            conn.send(mouseDownPacket);
            conn.send(mouseUpPacket);
          }

          prev.id = -1;
        }}
        onPointerMove={(e: PointerEvent) => {
          if (e.pointerId !== prev.id) {
            return;
          }
          delta.x = e.screenX - prev.lastPos.x;
          delta.y = e.screenY - prev.lastPos.y;
          const protocolPacket = getMouseMoveEventCommand(delta);
          conn.send(protocolPacket);

          prev.lastPos.x = e.screenX;
          prev.lastPos.y = e.screenY;
        }}
        style={{
          backgroundColor: Colors.dark.background,
          flex: 1,
          borderRadius: 20,
          overscrollBehavior: "none",
          touchAction: "none",
        }}
      ></View>
    </View>
  );
}
