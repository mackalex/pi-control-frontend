import { Colors } from "@/constants/Colors";
import { View } from "react-native";
import {
    RelMouseMove,
    getMouseClickEventCommand, getMouseMoveEventCommand,
    BROWSER_MOUSE_BUTTON, PICTRL_MOUSE_BUTTON, PICTRL_MOUSE_CLICK
} from "@/hooks/protocolBuffer";

const browser_to_pictrl_clicks = new Map<BROWSER_MOUSE_BUTTON, PICTRL_MOUSE_BUTTON>([
    [BROWSER_MOUSE_BUTTON.MAIN, PICTRL_MOUSE_BUTTON.LEFT],
    [BROWSER_MOUSE_BUTTON.SEC, PICTRL_MOUSE_BUTTON.RIGHT],
]);

export function MousePad() {
    let delta: RelMouseMove = {
        x: 0,
        y: 0
    };

    return (
        <View
            style={{
                flexDirection: 'column',
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
                    let button = e.button as BROWSER_MOUSE_BUTTON;
                    if (!browser_to_pictrl_clicks.has(button)) {
                        return;
                    }
                    const protocolPacket = getMouseClickEventCommand(browser_to_pictrl_clicks.get(button)!, PICTRL_MOUSE_CLICK.DOWN);
                    console.log(protocolPacket);
                }}
                onPointerUp={(e: PointerEvent) => {
                    let button = e.button as BROWSER_MOUSE_BUTTON;
                    if (!browser_to_pictrl_clicks.has(button)) {
                        return;
                    }
                    const protocolPacket = getMouseClickEventCommand(browser_to_pictrl_clicks.get(button)!, PICTRL_MOUSE_CLICK.UP);
                    console.log(protocolPacket);
                }}
                onPointerMove={(e: PointerEvent) => {
                    delta.x = e.movementX;
                    delta.y = e.movementY;
                    const protocolPacket = getMouseMoveEventCommand(delta);
                    console.log(protocolPacket);
                }}
                style={{
                    backgroundColor: Colors.dark.background,
                    flex: 1,
                    borderRadius: '20px',
                    overscrollBehavior: 'none',
                    touchAction: 'none',
                }}
            >
            </View>
        </View>
    )
}