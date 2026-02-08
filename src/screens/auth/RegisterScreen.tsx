import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { User, Mail, Lock } from "lucide-react-native";
import { register } from "@/api/auth/register";

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await register(name, email, password);
      Alert.alert("Success", "Akun berhasil dibuat! Cek email untuk verifikasi.");
      navigation.navigate("Login");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Gagal membuat akun");
    }
  };

  return (
    <View className="flex-1 bg-neutral-950 px-6 justify-center">

      {/* Header */}
      <View className="mb-12">
        <Text className="text-4xl font-maisonBold text-white tracking-wide">
          Buat Akun Baru
        </Text>
        <Text className="text-neutral-400 font-maison text-base mt-2">
          Daftar untuk mulai menggunakan Moto Tracker
        </Text>
      </View>

      {/* Form */}
      <View className="space-y-6">

        {/* Nama */}
        <Text className="text-white mb-2">Nama Lengkap</Text>
        <View className="flex-row items-center mb-5 border border-neutral-800 rounded-2xl px-4 py-4 shadow-md">
          <User size={22} color="#a3a3a3" />
          <TextInput
            placeholder="Nama lengkap"
            placeholderTextColor="#737373"
            className="flex-1 ml-3 text-white font-maison text-base"
            value={name}
            onChangeText={setName} // <- update state
          />
        </View>

        {/* Email */}
        <Text className="text-white mb-2">Email</Text>
        <View className="flex-row items-center mb-5 border border-neutral-800 rounded-2xl px-4 py-4 shadow-md">
          <Mail size={22} color="#a3a3a3" />
          <TextInput
            placeholder="email@example.com"
            placeholderTextColor="#737373"
            className="flex-1 ml-3 text-white font-maison text-base"
            value={email}
            onChangeText={setEmail} // <- update state
          />
        </View>

        {/* Password */}
        <Text className="text-white mb-2">Password</Text>
        <View className="flex-row items-center border border-neutral-800 rounded-2xl px-4 py-4 shadow-md">
          <Lock size={22} color="#a3a3a3" />
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#737373"
            secureTextEntry
            className="flex-1 ml-3 text-white font-maison text-base"
            value={password}
            onChangeText={setPassword} // <- update state
          />
        </View>

      </View>

      {/* Register Button */}
      <TouchableOpacity
        className="mt-5 bg-emerald-500 py-4 rounded-[10px] shadow-xl"
        onPress={handleRegister} // <- panggil function register
      >
        <Text className="text-center font-maisonBold text-black text-lg">
          Register
        </Text>
      </TouchableOpacity>

      {/* Footer */}
      <View className="flex-row justify-center mt-5">
        <Text className="text-neutral-400 font-maison text-base">
          Sudah punya akun?
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Text className="text-emerald-400 font-maisonBold ml-2">
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
