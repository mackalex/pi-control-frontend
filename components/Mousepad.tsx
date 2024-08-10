import { Colors } from "@/constants/Colors";
import { Text, View } from "react-native";
import { getMouseClickEventCommand, BROWSER_MOUSE_BUTTON, PICTRL_MOUSE_BUTTON, PICTRL_MOUSE_CLICK } from "@/hooks/protocolBuffer";

const browser_to_pictrl_clicks = new Map<BROWSER_MOUSE_BUTTON, PICTRL_MOUSE_BUTTON>([
    [BROWSER_MOUSE_BUTTON.MAIN, PICTRL_MOUSE_BUTTON.LEFT],
    [BROWSER_MOUSE_BUTTON.SEC, PICTRL_MOUSE_BUTTON.RIGHT],
]);

export function MousePad() {
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
            style={{ backgroundColor: Colors.dark.background, flex: 1, borderRadius: '20px' }}
            onMouseDown={(e: MouseEvent) => {
                let button = e.button as BROWSER_MOUSE_BUTTON;
                if (!browser_to_pictrl_clicks.has(button)) {
                    return;
                }
                const protocolPacket = getMouseClickEventCommand(browser_to_pictrl_clicks.get(button)!, PICTRL_MOUSE_CLICK.DOWN);
                console.log(protocolPacket);
            }}
            onMouseUp={(e: MouseEvent) => {
                let button = e.button as BROWSER_MOUSE_BUTTON;
                if (!browser_to_pictrl_clicks.has(button)) {
                    return;
                }
                const protocolPacket = getMouseClickEventCommand(browser_to_pictrl_clicks.get(button)!, PICTRL_MOUSE_CLICK.UP);
                console.log(protocolPacket);
            }}
            >
            </View>
        </View>
    )
}