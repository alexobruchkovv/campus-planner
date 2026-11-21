import React from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

interface CollapsibleProps {
  expanded: boolean;
  /** 0 — свёрнуто, 1 — раскрыто. Обычно результат useAnimatedFlag(expanded). */
  progress: SharedValue<number>;
  children: React.ReactNode;
}

/**
 * Блок, который плавно меняет высоту от 0 до высоты содержимого.
 * Содержимое измеряется через onLayout, поэтому высоту не нужно задавать вручную,
 * а соседние элементы списка сдвигаются, а не перекрываются.
 */
export default function Collapsible({ expanded, progress, children }: CollapsibleProps) {
  const contentHeight = useSharedValue(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    contentHeight.value = event.nativeEvent.layout.height;
  };

  const containerStyle = useAnimatedStyle(() => ({
    height: contentHeight.value * progress.value,
    opacity: progress.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View
        onLayout={handleLayout}
        style={[styles.content, { pointerEvents: expanded ? 'auto' : 'none' }]}
        // Свёрнутое содержимое скрыто от экранных дикторов.
        accessibilityElementsHidden={!expanded}
        importantForAccessibility={expanded ? 'auto' : 'no-hide-descendants'}
        aria-hidden={!expanded}
      >
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden' },
  // Абсолютное позиционирование позволяет измерить полную высоту, даже когда контейнер схлопнут.
  content: { position: 'absolute', top: 0, left: 0, right: 0 },
});
