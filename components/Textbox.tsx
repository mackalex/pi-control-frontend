import { TextInput, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { getTextEventCommand } from "@/hooks/protocolBuffer";
import { useState } from "react";
import { Colors } from "@/constants/Colors";

export function TextBox() {
    const [value, setValue] = useState('')
    const handleInput = () => {
        setValue('');
    }
    return (
        <View>
            <ThemedText type="subtitle">
                Ask, and your Pi shall receive:
            </ThemedText>
            <TextInput
                editable
                numberOfLines={1}
                cursorColor={Colors.dark.background}
                style={
                    {
                        marginTop: 20,
                        borderColor: 'black',
                        borderWidth: 2,
                        padding: 5
                    }
                }
                placeholder="Send text to your Raspberry Pi!"
                onChange={handleInput}
                value={value}
                onKeyPress={e => {
                    const protocolPacket = getTextEventCommand(e.nativeEvent.key.charCodeAt(0));
                    console.log(protocolPacket)
                }}
            />
        </View>
    )
}