import React, { useState } from 'react';
import { View, Dimensions, TouchableOpacity, Text } from 'react-native';
import { TabView } from 'react-native-tab-view';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { Gauge, Bike, Wrench, UserRound } from 'lucide-react-native';

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

type AnimatedTabIconProps = {
  focused: boolean;
  Icon: React.FC<{ color: string; size: number }>;
};

const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({ focused, Icon }) => {
  const scale = useSharedValue(focused ? 1.08 : 1);
  scale.value = withSpring(focused ? 1.08 : 1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Icon color={focused ? '#042F3A' : '#64748B'} size={23} />
    </Animated.View>
  );
};

export default function AnimatedBottomTab() {
  const [index, setIndex] = useState(0);
  const [routes] = useState<TabRoute[]>([
    { key: 'home', label: 'Home', icon: Gauge },
    { key: 'motor', label: 'Motor', icon: Bike },
    { key: 'service', label: 'Service', icon: Wrench },
    { key: 'profile', label: 'Profil', icon: UserRound },
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
    <View style={{ flex: 1, backgroundColor: '#050B18' }}>
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
          left: 40,
          right: 40,
          flexDirection: 'row',
          justifyContent: 'space-around',
          backgroundColor: '#0A1525',
          borderRadius: 999,
          borderWidth: 1,
          borderColor: '#1F3354',
          height: 64,
          alignItems: 'center',
          elevation: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.5,
          shadowRadius: 20,
          paddingHorizontal: 8,
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
                flex: 1,
                height: 48,
                gap: 2,
              }}>
              <View
                style={{
                  width: 40,
                  height: 32,
                  borderRadius: 999,
                  backgroundColor: focused ? '#22D3EE' : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <AnimatedTabIcon focused={focused} Icon={route.icon} />
              </View>
              <Text
                style={{
                  fontFamily: 'MaisonNeue-Bold',
                  fontSize: 9,
                  color: focused ? '#22D3EE' : '#475569',
                  letterSpacing: 0.3,
                }}>
                {route.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
