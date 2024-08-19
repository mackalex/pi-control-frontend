import { Image, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MousePad } from "@/components/Mousepad";
import { TextBox } from "@/components/Textbox";
import { Colors } from "@/constants/Colors";
import { Connection, WebSocketConnProps } from "@/components/Connection";
import React, { useState } from "react";

function Controls({ conn }: WebSocketConnProps) {
  if (conn == null) {
    return null;
  }
  return [
    <ThemedView style={styles.mousePadContainer} key="mousepad">
      <MousePad conn={conn} />
    </ThemedView>,
    <ThemedView style={styles.textBoxContainer} key="textbox">
      <TextBox conn={conn} />
    </ThemedView>,
  ];
}

export default function Index() {
  let [conn, setConn] = useState<WebSocket | null>(null);

  return (
    <View
      style={{
        height: "100%",
        backgroundColor: Colors.light.background,
      }}
    >
      <ThemedView style={styles.titleContainer}>
        <Image
          source={require("@/assets/images/brands/raspberry-pi.svg")}
          resizeMode="contain"
          style={{
            height: 100,
            width: 100,
            marginTop: 20,
          }}
        />
        <ThemedText type="title">PiControl</ThemedText>
      </ThemedView>
      <ThemedView style={styles.connectionContainer}>
        <Connection conn={conn} setConn={setConn} />
      </ThemedView>
      <Controls conn={conn} />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  mousePadContainer: {
    flex: 1.0,
  },
  textBoxContainer: {
    padding: 30,
  },
  connectionContainer: {
    padding: 10,
  },
});
