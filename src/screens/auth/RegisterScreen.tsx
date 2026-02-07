import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { User, Mail, Lock } from "lucide-react-native";

export default function RegisterScreen({ navigation }: any) {
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, backgroundColor: '#111827' }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="mb-12">
        <Text className="text-4xl font-maisonBold text-white tracking-wide mb-2">
          Create Account
        </Text>
        <Text className="text-neutral-400 font-maison text-base">
          Daftar dulu biar bisa mulai tracking motor kamu
        </Text>
      </View>

      {/* Form */}
      <View className="space-y-5">
        {/* Name */}
        <View className="flex-row items-center bg-neutral-900 border border-neutral-800 rounded-3xl px-4 py-4 shadow-md">
          <User size={22} color="#a3a3a3" />
          <TextInput
            placeholder="Nama Lengkap"
            placeholderTextColor="#737373"
            className="flex-1 ml-3 text-white font-maison text-base"
          />
        </View>

        {/* Email */}
        <View className="flex-row items-center bg-neutral-900 border border-neutral-800 rounded-3xl px-4 py-4 shadow-md">
          <Mail size={22} color="#a3a3a3" />
          <TextInput
            placeholder="email@example.com"
            placeholderTextColor="#737373"
            className="flex-1 ml-3 text-white font-maison text-base"
          />
        </View>

        {/* Password */}
        <View className="flex-row items-center bg-neutral-900 border border-neutral-800 rounded-3xl px-4 py-4 shadow-md">
          <Lock size={22} color="#a3a3a3" />
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#737373"
            secureTextEntry
            className="flex-1 ml-3 text-white font-maison text-base"
          />
        </View>
      </View>

      {/* Register Button */}
      <TouchableOpacity
        className="mt-10 py-5 rounded-3xl shadow-2xl bg-gradient-to-r from-emerald-500 to-green-400"
        onPress={() => navigation.navigate("Login")}
      >
        <Text className="text-center font-maisonBold text-black text-lg">
          Register
        </Text>
      </TouchableOpacity>

      {/* Footer */}
      <View className="flex-row justify-center mt-8 mb-12">
        <Text className="text-neutral-400 font-maison text-base">
          Sudah punya akun?
        </Text>
        <Text
          className="text-emerald-400 font-maisonBold ml-2"
          onPress={() => navigation.navigate("Login")}
        >
          Login
        </Text>
      </View>
    </ScrollView>
  );
}
