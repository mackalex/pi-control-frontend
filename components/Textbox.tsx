import { View } from "react-native";
import { ThemedText } from "./ThemedText";
import { getTextEventCommand } from "@/hooks/protocolBuffer";

export function TextBox() {
    return (
        <View>
            <ThemedText type="subtitle">
                Ask, and your Pi shall receive:
            </ThemedText>
            <textarea 
                rows={1}
                cols={40} 
                style={
                    {
                        marginTop: 20,
                        resize: 'none'
                    }
                }
                placeholder="Send text to your Raspberry Pi!"
                onChange={e => {
                    e.target.value = '';
                }}
                onKeyDown={e => {
                    const protocolPacket = getTextEventCommand(e.key.charCodeAt(0));
                    console.log(protocolPacket);
                }}
            />
        </View>
    )
}