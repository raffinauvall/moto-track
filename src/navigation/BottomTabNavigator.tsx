import React, { useState } from "react";
import { View, Dimensions, TouchableOpacity } from "react-native";
import { TabView } from "react-native-tab-view";
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from "react-native-reanimated";
import { Home, Bike, Clock, User } from "lucide-react-native";

import HomeScreen from "../screens/home/HomeScreen";
import MotorScreen from "@/screens/motor/MotorScreen";
import ProfileScreen from "@/screens/profile/ProfileScreen";
import ServiceScreen from "@/screens/service/ServiceScreen";

const initialLayout = { width: Dimensions.get("window").width };

type AnimatedTabIconProps = {
  focused: boolean;
  Icon: React.FC<{ color: string; size: number }>;
};

const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({ focused, Icon }) => {
  const scale = useSharedValue(focused ? 1.3 : 1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (focused) scale.value = withSpring(1.3);
  else scale.value = withSpring(1);

  return (
    <Animated.View style={animatedStyle}>
      <Icon color={focused ? "#34D399" : "#9CA3AF"} size={28} />
    </Animated.View>
  );
};

export default function AnimatedBottomTab() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "home", icon: Home },
    { key: "motor", icon: Bike },
    { key: "service", icon: Clock },
    { key: "profile", icon: User },
  ]);

  // ✅ renderScene manual supaya bisa pass prop
  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "home":
        return <HomeScreen />;
      case "motor":
        return <MotorScreen setIndex={setIndex} />; 
      case "service":
        return <ServiceScreen />; 
      case "profile":
        return <ProfileScreen />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#131313" }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={() => null} // custom tab
      />

      {/* Custom Bottom Tab */}
      <View
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          flexDirection: "row",
          justifyContent: "space-around",
          backgroundColor: "#212121",
          borderRadius: 25,
          height: 70,
          alignItems: "center",
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
        }}
      >
        {routes.map((route, i) => {
          const focused = index === i;

          return (
            <TouchableOpacity
              key={i}
              activeOpacity={0.8}
              onPress={() => setIndex(i)}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <AnimatedTabIcon focused={focused} Icon={route.icon} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
