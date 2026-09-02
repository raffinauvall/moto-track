import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Mail, Lock, Bike } from 'lucide-react-native';
import { useState } from 'react';
import { login } from '@/api/auth/login';
import { ToastService } from '@/utils/toastService';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const user = await login(email, password);

      ToastService.show(
        'success',
        'Login Berhasil',
        `Selamat datang, ${user?.user_metadata?.name || 'User'}`
      );
    } catch (err: any) {
      ToastService.show('error', 'Login Gagal', err.message || 'Cek email & password');
    }
  };
  return (
    <View className="h-screen justify-center bg-[#0A0A0A] px-7">
      {/* Logo + Header */}
      <View className="mb-12 items-start">
        <View className="mb-6 h-16 w-16 items-center justify-center rounded-[20px] bg-[#34D399]/10">
          <Bike size={32} color="#34D399" />
        </View>
        <Text className="font-maisonBold text-4xl tracking-wide text-white">
          Selamat Datang di Moto Tracker
        </Text>
        <Text className="mt-2 font-maison text-base text-neutral-500">Masuk untuk melanjutkan</Text>
      </View>

      {/* Form */}
      <View className="space-y-6">
        {/* Email Input */}
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

        {/* Password Input */}
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

      {/* Login Button */}
      <TouchableOpacity
        className="mt-8 rounded-[20px] bg-[#34D399] py-4"
        activeOpacity={0.85}
        onPress={handleLogin}>
        <Text className="text-center font-maisonBold text-lg text-[#052E2B]">Login</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View className="mt-6 flex-row justify-center">
        <Text className="font-maison text-base text-neutral-500">Belum punya akun?</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} activeOpacity={0.7}>
          <Text className="ml-2 font-maisonBold text-[#34D399]">Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
