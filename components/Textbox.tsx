import { NativeSyntheticEvent, TextInputKeyPressEventData, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { getTextEventCommand } from "@/hooks/protocolBuffer";
import { PiConnectionProps } from "./Connection";
import { TextInput } from "react-native-gesture-handler";


const SEND_ENTER_PROTOCOL_PACKET = getTextEventCommand('\n'.charCodeAt(0));

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
  return (
    <View>
      <ThemedText type="subtitle">Ask, and your Pi shall receive:</ThemedText>
        <View style={{flex: 1, flexDirection: "row"}}>
          <TextInput
            maxLength={0}
            multiline={false}
            returnKeyType="send"
            style={{
              marginTop: 20,
              borderColor: "black",
              borderWidth: 2,
              flexGrow: 1,
              padding: 10
            }}
            autoCapitalize="none"
            placeholder="Send text to your Raspberry Pi!"
            onKeyPress={(e) => {
              const protocolPacket = getTextEventCommand(getCodeForEvent(e));
              conn.send(protocolPacket);
            }}
            onSubmitEditing={(e) => {
              conn.send(SEND_ENTER_PROTOCOL_PACKET);
            }}
            blurOnSubmit={false}
          />
        </View>
    </View>
  );
}
