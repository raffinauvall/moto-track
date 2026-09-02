import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bike } from 'lucide-react-native';

export default function WelcomeScreen({ navigation }: any) {
  return (
    <LinearGradient
      colors={['#0A0A0A', '#0f172a', '#111827']} // dari black ke slate
      className="h-screen">
      {/* Top Illustration */}
      <View className="absolute top-24 w-full items-center">
        <View className="h-44 w-44 items-center justify-center rounded-full bg-[#34D399]/10">
          <Bike size={110} color="#34D399" />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 justify-end px-7 pb-28">
        <Text className="mb-4 font-maisonBold text-5xl tracking-wide text-white">
          Selamat Datang
        </Text>
        <Text className="mb-10 font-maison text-base text-neutral-400">
          Pantau jarak tempuh dan jadwal ganti oli motormu dengan mudah dan stylish.
        </Text>

        {/* Buttons */}
        <View className="space-y-4">
          <TouchableOpacity
            className="mb-3 rounded-[24px] bg-[#34D399] py-5 shadow-2xl"
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Login')}>
            <Text className="text-center font-maisonBold text-lg text-[#052E2B]">Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="rounded-[24px] border border-[#34D399] py-5"
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Register')}>
            <Text className="text-center font-maisonBold text-lg text-[#34D399]">Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}
