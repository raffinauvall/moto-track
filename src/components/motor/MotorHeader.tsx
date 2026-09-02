import { View, Text, TouchableOpacity } from 'react-native';
import { Bell, Motorbike } from 'lucide-react-native';

type MotorHeaderProps = {
  motorName: string;
  onBellPress?: () => void;
};

export default function MotorHeader({ motorName, onBellPress }: MotorHeaderProps) {
  return (
    <View className="mb-7 flex-row items-center justify-between pt-4">
      <View className="flex-1 pr-4">
        <Text className="mb-1 font-maison text-sm text-neutral-500">My Garage</Text>
        <View className="flex-row items-center gap-2.5">
          <View className="rounded-xl bg-[#34D399]/15 p-2">
            <Motorbike size={20} color="#34D399" />
          </View>
          <Text className="font-maisonBold text-2xl text-white" numberOfLines={1}>
            {motorName}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onBellPress}
        activeOpacity={0.7}
        className="rounded-2xl border border-neutral-800 bg-[#1E1E1E] p-3.5">
        <Bell size={20} color="#FAFAFA" />
      </TouchableOpacity>
    </View>
  );
}
