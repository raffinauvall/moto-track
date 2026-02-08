import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Mail, Lock } from "lucide-react-native";
import { useState } from "react";
import { supabase } from "@/api/supabaseClient";

export default function LoginScreen({navigation}: any) {
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      Alert.alert(
        "Login Berhasil",
        `Selamat datang, ${data.user?.user_metadata.name || "User"}`
      );

      navigation.navigate("MainTabs"); // navigasi setelah login
    } catch (err: any) {
      Alert.alert("Login Gagal", err.message || "Cek email & password");
    }
  };
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
            value={email}
            onChangeText={setEmail}
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
            value={password}
            onChangeText={setPassword}
          />
        </View>

      </View>

      {/* Login Button */}
      <TouchableOpacity className="mt-5 bg-emerald-500 py-4 rounded-[10px] shadow-xl"
      onPress={handleLogin}
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
