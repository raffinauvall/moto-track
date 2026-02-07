import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Mail, Lock } from "lucide-react-native";

export default function LoginScreen({navigation}: any) {
  return (
    <View className="flex-1 bg-neutral-950 px-6 justify-center">

      {/* Header */}
      <View className="mb-12">
        <Text className="text-4xl font-maisonBold text-white tracking-wide">
          Selamat Datang di Moto Tracker
        </Text>
        <Text className="text-neutral-400 font-maison text-base mt-2">
          Masuk untuk melanjutkan
        </Text>
      </View>

      {/* Form */}
      <View className="space-y-6">

        {/* Email Input */}
        <Text className="text-white mb-2">Email</Text>
        <View className="flex-row items-center mb-5 border border-neutral-800 rounded-2xl px-4 py-4 shadow-md">
          <Mail size={22} color="#a3a3a3" />
          <TextInput
            placeholder="email@example.com"
            placeholderTextColor="#737373"
            className="flex-1 ml-3 text-white font-maison text-base"
          />
        </View>

        {/* Password Input */}
        <Text className="text-white mb-2">Password</Text>
        <View className="flex-row items-center   border border-neutral-800 rounded-2xl px-4 py-4 shadow-md">
          <Lock size={22} color="#a3a3a3" />
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#737373"
            secureTextEntry
            className="flex-1 ml-3 text-white font-maison text-base"
          />
        </View>

      </View>

      {/* Login Button */}
      <TouchableOpacity className="mt-5 bg-emerald-500 py-4 rounded-[10px] shadow-xl"
      onPress={() => navigation.navigate("MainTabs")}
      >
        <Text className="text-center font-maisonBold text-black text-lg">
          Login
        </Text>
      </TouchableOpacity>

      {/* Footer */}
      <View className="flex-row justify-center mt-5">
        <Text className="text-neutral-400 font-maison text-base">
          Belum punya akun?
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          activeOpacity={0.7}
        >
          <Text className="text-emerald-400 font-maisonBold ml-2">
            Register
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}
