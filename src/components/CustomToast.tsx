import React, { useEffect, useState } from "react";
import { Animated, Text, View, StyleSheet, Dimensions } from "react-native";

type ToastProps = {
  type: "success" | "error";
  title: string;
  message?: string;
  duration?: number;
  onHide?: () => void;
};

export default function CustomToast({ type, title, message, duration = 2000, onHide }: ToastProps) {
  const [visible, setVisible] = useState(true);
  const slideAnim = new Animated.Value(-100);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
        onHide?.();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const bgColor = type === "success" ? "#34D399" : "#F87171";

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: bgColor, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    zIndex: 1000,
    maxWidth: Dimensions.get("window").width - 40,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  message: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    marginTop: 2,
  },
});
