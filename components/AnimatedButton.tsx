import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

interface Props {
  label: string;
  onPress: () => void;
  color?: string;
  icon?: string;
}

export default function AnimatedButton({ label, onPress, color, icon }: Props) {
  const scale = useSharedValue(1);

  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => (scale.value = withTiming(0.96, { duration: 80 }))}
      onPressOut={() => (scale.value = withTiming(1, { duration: 80 }))}
      onPress={onPress}
    >
      <Animated.View
        style={[styles.btn, anim, { backgroundColor: color || "#1b263b" }]}
      >
        <View style={styles.content}>
          {icon && (
            <Ionicons name={icon as any} size={20} color="white" style={styles.icon} />
          )}
          <Text style={styles.text}>{label}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginVertical: 8,
    alignItems: "center",
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});