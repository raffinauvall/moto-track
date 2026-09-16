import { View, Text, TouchableOpacity } from 'react-native';
import { Bike } from 'lucide-react-native';

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View className="flex-1 bg-[#070B12] px-6 pb-10 pt-16">
      <View className="items-center">
        <View className="h-20 w-20 items-center justify-center rounded-[24px] border border-[#243244] bg-[#111A27] p-3">
          <Bike size={34} color="#22D3EE" strokeWidth={1.8} />
        </View>
        <Text className="mt-5 font-maisonBold text-xl text-white">MotoTrack</Text>
      </View>

      <View className="mt-auto">
        <View className="mb-5 h-1 w-12 rounded-full bg-cyan-400" />
        <Text className="font-maisonBold text-4xl leading-[44px] text-white">
          Rawat motor.{'\n'}Nikmati perjalanan.
        </Text>
        <Text className="mt-3 font-maison text-base leading-6 text-slate-400">
          Catat servis, pantau kondisi, dan simpan riwayat perjalanan dalam satu tempat.
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          className="mt-8 rounded-2xl bg-cyan-400 py-4"
          activeOpacity={0.85}>
          <Text className="text-center font-maisonBold text-base text-[#042F3A]">Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          className="mt-3 rounded-2xl border border-[#243244] bg-[#111A27] py-4"
          activeOpacity={0.85}>
          <Text className="text-center font-maisonBold text-base text-cyan-300">Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
