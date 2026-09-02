import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { User, Mail, Lock, Bike } from 'lucide-react-native';
import { register } from '@/api/auth/register';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await register(name, email, password);
      Alert.alert('Success', 'Akun berhasil dibuat! Cek email untuk verifikasi.');
      navigation.navigate('Login');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Gagal membuat akun');
    }
  };

  return (
    <View className="h-screen justify-center bg-[#0A0A0A] px-7">
      {/* Logo + Header */}
      <View className="mb-10 items-start">
        <View className="mb-6 h-16 w-16 items-center justify-center rounded-[20px] bg-[#34D399]/10">
          <Bike size={32} color="#34D399" />
        </View>
        <Text className="font-maisonBold text-4xl tracking-wide text-white">Buat Akun Baru</Text>
        <Text className="mt-2 font-maison text-base text-neutral-500">
          Daftar untuk mulai menggunakan Moto Tracker
        </Text>
      </View>

      {/* Form */}
      <View className="space-y-6">
        {/* Nama */}
        <View>
          <Text className="mb-2 font-maison text-sm text-neutral-300">Nama Lengkap</Text>
          <View className="flex-row items-center rounded-2xl border border-neutral-800 bg-[#161616] px-4 py-4">
            <User size={20} color="#a3a3a3" />
            <TextInput
              placeholder="Nama lengkap"
              placeholderTextColor="#737373"
              className="ml-3 flex-1 font-maison text-base text-white"
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        {/* Email */}
        <View>
          <Text className="mb-2 font-maison text-sm text-neutral-300">Email</Text>
          <View className="flex-row items-center rounded-2xl border border-neutral-800 bg-[#161616] px-4 py-4">
            <Mail size={20} color="#a3a3a3" />
            <TextInput
              placeholder="email@example.com"
              placeholderTextColor="#737373"
              className="ml-3 flex-1 font-maison text-base text-white"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </View>

        {/* Password */}
        <View>
          <Text className="mb-2 font-maison text-sm text-neutral-300">Password</Text>
          <View className="flex-row items-center rounded-2xl border border-neutral-800 bg-[#161616] px-4 py-4">
            <Lock size={20} color="#a3a3a3" />
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#737373"
              secureTextEntry
              className="ml-3 flex-1 font-maison text-base text-white"
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>
      </View>

      {/* Register Button */}
      <TouchableOpacity
        className="mt-8 rounded-[20px] bg-[#34D399] py-4"
        activeOpacity={0.85}
        onPress={handleRegister}>
        <Text className="text-center font-maisonBold text-lg text-[#052E2B]">Register</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View className="mt-6 flex-row justify-center">
        <Text className="font-maison text-base text-neutral-500">Sudah punya akun?</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}>
          <Text className="ml-2 font-maisonBold text-[#34D399]">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
