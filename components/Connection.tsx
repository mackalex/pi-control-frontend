import { Pressable, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";

const DEFAULT_PORT = 14741;

type PiConn = WebSocket;
export type PiConnectionProps = {
  conn: PiConn;
};
type OptionalConn = PiConn | null;
export type WebSocketConnProps = {
  conn: OptionalConn;
};

type ConnectionComponentProps = WebSocketConnProps & {
  setConn: React.Dispatch<React.SetStateAction<OptionalConn>>;
};

// https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
enum CloseCodes {
  NORMAL = 1000,
}

function ipIsValid(ip: string): boolean {
  // TODO: Validate more
  return !!ip;
}

function portIsValid(port: string): boolean {
  // TODO: Validate more
  return !!port && !isNaN(parseInt(port));
}

function getWSUrl(ip: string, port: string): string {
  return `ws://${ip}:${port}`;
}

type ErrorProps = {
  error: string;
};
function ErrorComponent({ error }: ErrorProps) {
  return error ?
      <ThemedText style={{ color: "red", fontWeight: 700}}>Error: {error}</ThemedText>
  : null
}

export function Connection({ conn, setConn }: ConnectionComponentProps) {
  let [ip, setIp] = useState("");
  let [port, setPort] = useState(DEFAULT_PORT.toString());

  let [err, setErr] = useState("");

  let setCallbacks = (ws: WebSocket) => {
    ws.onopen = (event: Event) => {
      setConn(ws);
      setErr("");
    };

    ws.onerror = (error) => {
      setErr("A WebSocket error occurred!");
    };

    ws.onclose = (ev: CloseEvent) => {
      switch (ev.code) {
        case CloseCodes.NORMAL:
          console.log("WebSocket closed by user.");
          break;
        default:
          break;
      }
    };
  };

  let connect = (ip: string, port: string): OptionalConn => {
    if (!ipIsValid(ip)) {
      setErr("Invalid IP!");
      return null;
    }
    if (!portIsValid(port)) {
      setErr("Invalid port!");
      return null;
    }

    const ws = new WebSocket(getWSUrl(ip, port), ["picontrol"]);
    setCallbacks(ws);
    return ws;
  };

  let ConnectButton = () => {
    return (
      <Pressable
        onPress={() => connect(ip, port)}
        style={{
          ...styles.connectButton,
          backgroundColor: "#33b249",
        }}
      >
        <ThemedText style={styles.connectButtonText}>Connect!</ThemedText>
      </Pressable>
    );
  };

  let DisconnectButton = () => {
    return (
      <Pressable
        onPress={() => setConn(null)}
        style={{
          ...styles.connectButton,
          backgroundColor: "#D22B2B",
        }}
      >
        <ThemedText style={styles.connectButtonText}>Disconnect</ThemedText>
      </Pressable>
    );
  };

  useEffect(() => {
    return () => {
      if (
        !conn ||
        !([WebSocket.CONNECTING, WebSocket.OPEN] as number[]).includes(
          conn.readyState,
        )
      ) {
        return;
      }
      conn.close(CloseCodes.NORMAL, "Disconnected by user.");
    };
  }, [conn]);

  return (
    <View
      style={{
        flexDirection: "column",
      }}
    >
      <ThemedText type="subtitle">Connect to your Pi:</ThemedText>
      <View>
        <ErrorComponent error={err} />
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        <GestureHandlerRootView style={{flex: 1, flexDirection: "row"}}>
          <TextInput
            style={[{ flex: 3 }, styles.inputBox]}
            placeholder="IP"
            inputMode="url"
            readOnly={!!conn}
            value={ip}
            onChangeText={(text) => setIp(text)}
          />
          <TextInput
            style={[{ flex: 1 }, styles.inputBox]}
            value={port}
            inputMode="numeric"
            readOnly={!!conn}
            placeholder="Port"
            onChangeText={(text) => setPort(text)}
          />
        </GestureHandlerRootView>
      </View>
      <View>{!!conn ? <DisconnectButton /> : <ConnectButton />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputBox: {
    borderColor: "black",
    borderWidth: 2,
    padding: 4
  },
  connectButton: {
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  connectButtonText: {
    color: "white",
    userSelect: "none",
  },
});
