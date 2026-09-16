import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Bike, Mail, Lock } from 'lucide-react-native';
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
    <View className="flex-1 bg-[#070B12] px-6 pb-10 pt-16">
      {/* Logo + Header */}
      <View className="mb-10 items-start">
        <View className="mb-6 h-14 w-14 items-center justify-center rounded-2xl border border-[#243244] bg-[#111A27]">
          <Bike size={28} color="#22D3EE" strokeWidth={1.8} />
        </View>
        <Text className="font-maisonBold text-4xl leading-[44px] text-white">Welcome back</Text>
        <Text className="mt-2 font-maison text-base text-slate-400">
          Masuk ke garage digital lo.
        </Text>
      </View>

      {/* Form */}
      <View className="rounded-3xl border border-[#243244] bg-[#111A27] p-5">
        {/* Email Input */}
        <View className="mb-5">
          <Text className="mb-2 font-maison text-sm text-slate-300">Email</Text>
          <View className="flex-row items-center rounded-2xl border border-[#243244] bg-[#070B12] px-4 py-4">
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

        {/* Password Input */}
        <View>
          <Text className="mb-2 font-maison text-sm text-slate-300">Password</Text>
          <View className="flex-row items-center rounded-2xl border border-[#243244] bg-[#070B12] px-4 py-4">
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

      {/* Login Button */}
      <TouchableOpacity
        className="mt-8 rounded-[22px] bg-cyan-400 py-5"
        activeOpacity={0.85}
        onPress={handleLogin}>
        <Text className="text-center font-maisonBold text-lg text-[#042F3A]">Login</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View className="mt-6 flex-row justify-center">
        <Text className="font-maison text-base text-slate-500">Belum punya akun?</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} activeOpacity={0.7}>
          <Text className="ml-2 font-maisonBold text-cyan-300">Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
