import { View } from "react-native";
import { ThemedText } from "./ThemedText";

export function TextBox() {
    return (
        <View>
            <ThemedText type="subtitle">
                Ask, and your Pi shall receive:
            </ThemedText>
            <textarea 
                rows={15}
                cols={40} 
                style={
                    {
                        marginTop: 20
                    }
                }
                onKeyDown={e => {
                    console.log("event type: " + e.type)
                    console.log("char code: " + e.key.charCodeAt(0))
                }}
                onKeyUp={e => {
                    console.log("event type: " + e.type)
                    console.log("char code: " + e.key.charCodeAt(0))
                }}
            />
        </View>
    )
}