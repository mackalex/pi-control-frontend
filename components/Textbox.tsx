import { NativeSyntheticEvent, TextInputKeyPressEventData, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { getTextEventCommand } from "@/hooks/protocolBuffer";
import { PiConnectionProps } from "./Connection";
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import { useState } from "react";


function getCodeForEvent(e: NativeSyntheticEvent<TextInputKeyPressEventData>): number {
  switch (e.nativeEvent.key) {
    case "Enter":
      return 10; // ASCII LF
    case "Backspace":
      return 127; // ASCII DEL
  };
  return e.nativeEvent.key.charCodeAt(0);
}

export function TextBox({ conn }: PiConnectionProps) {
  let [text, setText] = useState("");

  return (
    <View>
      <ThemedText type="subtitle">Ask, and your Pi shall receive:</ThemedText>
        <GestureHandlerRootView style={{flex: 1, flexDirection: "row"}}>
          <TextInput
            style={{
              marginTop: 20,
              borderColor: "black",
              borderWidth: 2,
              flexGrow: 1
            }}
            value={text}
            placeholder="Send text to your Raspberry Pi!"
            onKeyPress={(e) => {
              const protocolPacket = getTextEventCommand(getCodeForEvent(e));
              conn.send(protocolPacket);
              setText("");
            }}
          />
        </GestureHandlerRootView>
    </View>
  );
}
