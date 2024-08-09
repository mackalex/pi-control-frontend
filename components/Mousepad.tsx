import { Colors } from "@/constants/Colors";
import { Text, View } from "react-native";
import { getMouseClickEventCommand, BROWSER_MOUSE_BUTTONS, PICTRL_MOUSE_BUTTONS, PICTRL_MOUSE_CLICK } from "@/hooks/protocolBuffer";

const browser_to_pictrl_clicks = new Map<BROWSER_MOUSE_BUTTONS, PICTRL_MOUSE_BUTTONS>([
    [BROWSER_MOUSE_BUTTONS.MAIN, PICTRL_MOUSE_BUTTONS.PI_CTRL_MOUSE_LEFT],
    [BROWSER_MOUSE_BUTTONS.SEC, PICTRL_MOUSE_BUTTONS.PI_CTRL_MOUSE_RIGHT],
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
                let button = e.button as BROWSER_MOUSE_BUTTONS;
                if (!(browser_to_pictrl_clicks.has(button))) {
                    return;
                }
                const protocolPacket = getMouseClickEventCommand(browser_to_pictrl_clicks.get(button)!, PICTRL_MOUSE_CLICK.PI_CTRL_MOUSE_DOWN);
                console.log(protocolPacket);
            }}
            onMouseUp={(e: MouseEvent) => {
                let button = e.button as BROWSER_MOUSE_BUTTONS;
                if (!(browser_to_pictrl_clicks.has(button))) {
                    return;
                }
                const protocolPacket = getMouseClickEventCommand(browser_to_pictrl_clicks.get(button)!, PICTRL_MOUSE_CLICK.PI_CTRL_MOUSE_UP);
                console.log(protocolPacket);
            }}
            >
            </View>
        </View>
    )
}