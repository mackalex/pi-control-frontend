import { Image, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MousePad } from '@/components/Mousepad';

export default function Index() {
  return (
    <View>
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
});