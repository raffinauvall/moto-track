import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { LogOut, Bike, Wrench, ChevronRight } from 'lucide-react-native';
import { getMotor } from '@/api/motor/getMotor';
import { getService } from '@/api/service/getService';
import { getCurrentUser, signOut } from '@/api';
import type { AppUser } from '@/types';

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [motorCount, setMotorCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        const motors = await getMotor();
        setMotorCount(motors.length);

        const service = await getService();
        setServiceCount(service.length);
      } catch (err: any) {
        Alert.alert('Error', err.message);
      }
    };

    init();
  }, []);

  const handleLogout = async () => {
    await signOut();

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0A0A0A]">
        <ActivityIndicator size="large" color="#34D399" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#0A0A0A]" showsVerticalScrollIndicator={false}>
      <View className="items-center rounded-b-[40px] bg-[#161616] pb-10 pt-16">
        <View className="mb-4 h-28 w-28 items-center justify-center rounded-full border-4 border-neutral-700 bg-[#1E1E1E]">
          <Image
            source={{ uri: `https://i.pravatar.cc/200?u=${user.id}` }}
            className="h-24 w-24 rounded-full"
          />
        </View>

        <Text className="font-maisonBold text-2xl text-white">
          {user.user_metadata?.name || 'Rider'}
        </Text>

        <Text className="mt-1 font-maison text-sm text-neutral-500">{user.email}</Text>
      </View>

      {/* stats */}
      <View className="mt-8 flex-row justify-between px-6">
        <View className="w-[48%] rounded-[24px] bg-[#161616] p-5">
          <View className="flex-row items-center justify-between">
            <View className="rounded-xl bg-[#22C55E]/10 p-2">
              <Bike color="#22C55E" size={20} />
            </View>
            <Text className="font-maisonBold text-2xl text-emerald-400">{motorCount}</Text>
          </View>
          <Text className="mt-3 font-maison text-sm text-neutral-500">Motors</Text>
        </View>

        <View className="w-[48%] rounded-[24px] bg-[#161616] p-5">
          <View className="flex-row items-center justify-between">
            <View className="rounded-xl bg-[#FACC15]/10 p-2">
              <Wrench color="#FACC15" size={20} />
            </View>
            <Text className="font-maisonBold text-2xl text-yellow-400">{serviceCount}</Text>
          </View>
          <Text className="mt-3 font-maison text-sm text-neutral-500">Services</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        className="mx-6 mt-8 flex-row items-center justify-center gap-2 rounded-[20px] border border-red-500/20 bg-[#1E1E1E] py-4">
        <LogOut size={18} color="#EF4444" />
        <Text className="font-maisonBold text-red-500">Logout</Text>
        <ChevronRight size={16} color="#EF4444" />
      </TouchableOpacity>
    </ScrollView>
  );
}
