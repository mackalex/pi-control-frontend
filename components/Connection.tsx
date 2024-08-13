import { Pressable, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const DEFAULT_PORT = 14741;

function ipIsValid(ip: string): boolean {
    // TODO: Validate
    return true;
}

function portIsValid(port: string): boolean {
    // TODO: Validate
    return true;
}

function connect(ip: string, port: string): void {
    if (!ipIsValid(ip)) {
        console.error("Invalid IP!");
        return;
    }
    if (!portIsValid(port)) {
        console.error("Invalid port!");
        return;
    }
    console.log(`TODO: Connect to ${ip}:${port}`)
}

export function Connection() {
    let [ip, setIp] = useState("");
    let [port, setPort] = useState(DEFAULT_PORT.toString());
    return (
        <View
            style={{
                flexDirection: 'column',
            }}
        >
            <ThemedText type="subtitle">
                Connect to your Pi:
            </ThemedText>
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    marginBottom: 10,
                }}
            >
                <TextInput
                    style={[{ flex: 3 }, styles.inputBox]}
                    placeholder="IP"
                    value={ip}
                    onChangeText={(text) => setIp(text)}
                />
                <TextInput
                    style={[{ flex: 1 }, styles.inputBox]}
                    value={port}
                    placeholder="Port"
                    onChangeText={(text) => setPort(text)}
                />
            </View>
            <Pressable
                onPress={() => connect(ip, port)}
                style={{
                    backgroundColor: '#33b249',
                    borderRadius: 7,
                    alignItems: 'center',
                }}
            >
                <ThemedText
                    style={{
                        color: "white",
                        userSelect: 'none'
                    }}
                >Connect!</ThemedText>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    inputBox: {
        borderColor: "black",
        borderWidth: 2
    }
});