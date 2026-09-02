import React, { useState } from 'react';
import { View, Dimensions, TouchableOpacity, Text } from 'react-native';
import { TabView } from 'react-native-tab-view';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { Home, Bike, Clock, User } from 'lucide-react-native';

import HomeScreen from '../screens/home/HomeScreen';
import MotorScreen from '@/screens/motor/MotorScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import HistoryServiceScreen from '@/screens/service/HistoryServiceScreen';

const initialLayout = { width: Dimensions.get('window').width };

type TabRoute = {
  key: string;
  label: string;
  icon: React.FC<{ color: string; size: number }>;
};

const TAB_LABELS: Record<string, string> = {
  home: 'Home',
  motor: 'Motor',
  service: 'Service',
  profile: 'Profil',
};

type AnimatedTabIconProps = {
  focused: boolean;
  Icon: React.FC<{ color: string; size: number }>;
};

const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({ focused, Icon }) => {
  const scale = useSharedValue(focused ? 1.2 : 1);
  scale.value = withSpring(focused ? 1.2 : 1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Icon color={focused ? '#34D399' : '#9CA3AF'} size={26} />
    </Animated.View>
  );
};

export default function AnimatedBottomTab() {
  const [index, setIndex] = useState(0);
  const [routes] = useState<TabRoute[]>([
    { key: 'home', label: 'Home', icon: Home },
    { key: 'motor', label: 'Motor', icon: Bike },
    { key: 'service', label: 'Service', icon: Clock },
    { key: 'profile', label: 'Profil', icon: User },
  ]);

  // ✅ renderScene manual supaya bisa pass prop
  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'home':
        return <HomeScreen setIndex={setIndex} />;
      case 'motor':
        return <MotorScreen setIndex={setIndex} />;
      case 'service':
        return <HistoryServiceScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={() => null} // custom tab
      />

      {/* Custom Floating Bottom Tab */}
      <View
        style={{
          position: 'absolute',
          bottom: 18,
          left: 24,
          right: 24,
          flexDirection: 'row',
          justifyContent: 'space-around',
          backgroundColor: '#161616',
          borderRadius: 28,
          borderWidth: 1,
          borderColor: '#262626',
          height: 68,
          alignItems: 'center',
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
        }}>
        {routes.map((route, i) => {
          const focused = index === i;

          return (
            <TouchableOpacity
              key={i}
              activeOpacity={0.7}
              onPress={() => setIndex(i)}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 14,
                gap: 2,
              }}>
              <AnimatedTabIcon focused={focused} Icon={route.icon} />
              <Text
                className="font-maison text-[10px]"
                style={{ color: focused ? '#34D399' : '#737373' }}>
                {TAB_LABELS[route.key]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
