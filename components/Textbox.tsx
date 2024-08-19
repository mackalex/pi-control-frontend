import { View } from "react-native";
import { ThemedText } from "./ThemedText";
import { getTextEventCommand } from "@/hooks/protocolBuffer";
import { PiConnectionProps } from "./Connection";


function getCodeForEvent(e: React.KeyboardEvent): number {
  switch (e.key) {
    case "Enter":
      return 10; // ASCII LF
    case "Backspace":
      return 127; // ASCII DEL
  };
  return e.key.charCodeAt(0);
}

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
          const protocolPacket = getTextEventCommand(getCodeForEvent(e));
          conn.send(protocolPacket);
        }}
      />
    </View>
  );
}
