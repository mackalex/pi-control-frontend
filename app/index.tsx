import { Image, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MousePad } from '@/components/Mousepad';
import { TextBox } from '@/components/Textbox';
import { Colors } from '@/constants/Colors';

export default function Index() {
  return (
    <View 
      style={{
        height: '100%',
        backgroundColor: Colors.light.background
      }}
    >
      <ThemedView style={styles.titleContainer}>
        <Image 
            source={require('@/assets/images/brands/raspberry-pi.svg')}
            resizeMode='contain'
            style={{
              height: 100,
              width: 100,
              marginTop: 20
            }}
          />
        <ThemedText type="title">
          PiControl
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.mousePadContainer}>
        <MousePad />
      </ThemedView>
      <ThemedView style={styles.textBoxContainer}>
        <TextBox />
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
  mousePadContainer: {
    flex: 1.0
  },
  textBoxContainer: {
    padding: 30
  }
});