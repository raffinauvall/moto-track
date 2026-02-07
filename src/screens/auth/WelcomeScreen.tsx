import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Bike } from "lucide-react-native";

export default function WelcomeScreen({ navigation }: any) {
  return (
    <LinearGradient
      colors={['#0f172a', '#111827']} // dari neutral-950 ke neutral-900
      className="flex-1"
    >

      {/* Top Illustration */}
      <View className="absolute top-20 w-full items-center">
        <Bike size={120} color="#34D399" />
      </View>

      {/* Content */}
      <View className="flex-1 justify-end px-6 pb-24">
        <Text className="text-5xl font-maisonBold text-white tracking-wide mb-4">
          Selamat Datang
        </Text>
        <Text className="text-neutral-400 font-maison text-base mb-8">
          Pantau jarak tempuh dan jadwal ganti oli motormu dengan mudah dan stylish.
        </Text>

        {/* Buttons */}
        <View className="space-y-4">
          <TouchableOpacity
            className="py-5 border border-white mb-3 rounded-3xl shadow-2xl bg-gradient-to-r from-emerald-500 to-green-400"
            onPress={() => navigation.navigate("Login")}
          >
            <Text className="text-center font-maisonBold text-white text-lg">
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="border border-emerald-500 py-5 rounded-3xl shadow-md"
            onPress={() => navigation.navigate("Register")}
          >
            <Text className="text-center font-maisonBold text-emerald-400 text-lg">
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}
