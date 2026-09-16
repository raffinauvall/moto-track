import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Bike, User, Mail, Lock } from 'lucide-react-native';
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
    <View className="flex-1 bg-[#050B18] px-6 pb-10 pt-16">
      {/* Logo + Header */}
      <View className="mb-10 items-start">
        <View className="mb-6 h-14 w-14 items-center justify-center rounded-2xl border border-[#1F3354] bg-[#0D1728]">
          <Bike size={28} color="#22D3EE" strokeWidth={1.8} />
        </View>
        <Text className="font-maisonBold text-4xl leading-[44px] text-white">Create account</Text>
        <Text className="mt-2 font-maison text-base text-slate-400">
          Mulai tracking motor dengan dashboard baru.
        </Text>
      </View>

      {/* Form */}
      <View className="rounded-[28px] border border-[#1F3354] bg-[#0D1728] p-5">
        {/* Nama */}
        <View className="mb-5">
          <Text className="mb-2 font-maison text-sm text-slate-300">Nama Lengkap</Text>
          <View className="flex-row items-center rounded-2xl border border-[#1F3354] bg-[#050B18] px-4 py-4">
            <User size={20} color="#64748B" />
            <TextInput
              placeholder="Nama lengkap"
              placeholderTextColor="#475569"
              className="ml-3 flex-1 font-maison text-base text-white"
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        {/* Email */}
        <View className="mb-5">
          <Text className="mb-2 font-maison text-sm text-slate-300">Email</Text>
          <View className="flex-row items-center rounded-2xl border border-[#1F3354] bg-[#050B18] px-4 py-4">
            <Mail size={20} color="#64748B" />
            <TextInput
              placeholder="email@example.com"
              placeholderTextColor="#475569"
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
          <Text className="mb-2 font-maison text-sm text-slate-300">Password</Text>
          <View className="flex-row items-center rounded-2xl border border-[#1F3354] bg-[#050B18] px-4 py-4">
            <Lock size={20} color="#64748B" />
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#475569"
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
        className="mt-8 rounded-[22px] bg-cyan-400 py-5"
        activeOpacity={0.85}
        onPress={handleRegister}>
        <Text className="text-center font-maisonBold text-lg text-[#042F3A]">Register</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View className="mt-6 flex-row justify-center">
        <Text className="font-maison text-base text-slate-500">Sudah punya akun?</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}>
          <Text className="ml-2 font-maisonBold text-cyan-300">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
