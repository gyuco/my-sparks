import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface AIStreamingIndicatorProps {
  isStreaming: boolean;
}

export function AIStreamingIndicator({ isStreaming }: AIStreamingIndicatorProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isStreaming) {
      // Animazione pulsante
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1.2,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0.5,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    } else {
      opacity.setValue(0);
      scale.setValue(1);
    }
  }, [isStreaming, opacity, scale]);

  if (!isStreaming) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons name="sparkles" size={16} color="#00D4FF" />
        <ThemedText style={styles.text}>IA sta scrivendo...</ThemedText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00D4FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: 14,
    color: '#00D4FF',
    fontWeight: '600',
  },
});
