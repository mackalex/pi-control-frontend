import { View } from "react-native";
import { ThemedText } from "./ThemedText";
import { getTextEventCommand } from "@/hooks/protocolBuffer";
import { PiConnectionProps } from "./Connection";

export function TextBox({ conn }: PiConnectionProps) {
  return (
    <View>
      <ThemedText type="subtitle">Ask, and your Pi shall receive:</ThemedText>
      <textarea
        rows={1}
        cols={40}
        style={{
          marginTop: 20,
          resize: "none",
        }}
        placeholder="Send text to your Raspberry Pi!"
        onChange={(e) => {
          e.target.value = "";
        }}
        onKeyDown={(e) => {
          const protocolPacket = getTextEventCommand(e.key.charCodeAt(0));
          conn.send(protocolPacket);
        }}
      />
    </View>
  );
}
