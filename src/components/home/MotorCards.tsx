import { View, Text, TouchableOpacity } from 'react-native';
import { Motorbike } from 'lucide-react-native';
import MotorHealthBar from '@/components/motor/MotorHealthBar';

type Props = {
  motor: string;
  health?: number; // health bisa dikirim
  onChangeMotor?: () => void; // tombol Change muncul jika function dikirim
};

export default function MotorCard({ motor, health = 100, onChangeMotor }: Props) {
  return (
    <View className="mb-6 overflow-hidden rounded-[28px] bg-[#161616] p-6">
      {/* soft glow accent */}
      <View className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-[#34D399] opacity-10" />

      {/* Header */}
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2.5">
          <View className="rounded-xl bg-[#34D399]/15 p-2.5">
            <Motorbike color="#34D399" size={20} />
          </View>
          <Text className="font-maison text-sm text-neutral-400">Active Motor</Text>
        </View>

        {/* Tombol Change hanya muncul kalau ada function */}
        {onChangeMotor && (
          <TouchableOpacity
            onPress={onChangeMotor}
            activeOpacity={0.7}
            className="rounded-full border border-neutral-700 px-3.5 py-1.5">
            <Text className="font-maisonBold text-xs text-[#34D399]">Change</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Nama Motor */}
      <Text className="mb-1 font-maisonBold text-[26px] leading-8 text-white" numberOfLines={1}>
        {motor || 'No Active Motor'}
      </Text>

      {/* Health Bar */}
      <MotorHealthBar value={health} />
    </View>
  );
}
