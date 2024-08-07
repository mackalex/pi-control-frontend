import { Image, StyleSheet, Platform, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MousePad } from '@/components/Mousepad';

export default function HomeScreen() {
  return (
    <View>
      <ThemedView style={styles.titleContainer}>
        <Image 
            source={require('@/assets/images/brands/raspberry-pi.svg')}
            style={{
              resizeMode: "contain",
              height: 100,
              width: 100,
              marginTop: 20
            }}
          />
        <ThemedText type="title">
          PiControl
        </ThemedText>
      </ThemedView>
      <ThemedView>
        <MousePad />
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  }
});
