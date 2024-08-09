import { Colors } from "@/constants/Colors";
import { Text, View } from "react-native";

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
            <View style={{ backgroundColor: Colors.dark.background, flex: 1, borderRadius: '20px' }} >
            </View>
        </View>
    )
}