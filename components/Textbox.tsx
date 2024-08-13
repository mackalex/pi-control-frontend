import { TextInput, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { getTextEventCommand } from "@/hooks/protocolBuffer";

export function TextBox() {
    return (
        <View>
            <ThemedText type="subtitle">
                Ask, and your Pi shall receive:
            </ThemedText>
            <TextInput
                editable
                numberOfLines={1}
                style={
                    {
                        marginTop: 20,
                        borderColor: 'black',
                        borderWidth: 2
                    }
                }
                placeholder="Send text to your Raspberry Pi!"
                onChange={e => {
                    e.nativeEvent.text = '';
                }}
                onKeyPress={e => {
                    const protocolPacket = getTextEventCommand(e.nativeEvent.key.charCodeAt(0));
                }}
            />
        </View>
    )
}