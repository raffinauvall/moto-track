import { Bell } from 'lucide-react-native';
import { View, Text, TouchableOpacity } from 'react-native';

export default function Header({
  name,
  onBellPress,
  badgeCount = 0,
}: {
  name: string;
  onBellPress?: () => void;
  badgeCount?: number;
}) {
  const firstName = name.trim().split(' ')[0] || 'Rider';

  return (
    <View className="mb-7 flex-row items-center justify-between pt-4">
      <View className="flex-1 pr-4">
        <Text className="mb-1 font-maison text-sm text-neutral-500">Welcome Back 👋</Text>
        <Text className="font-maisonBold text-[28px] leading-9 text-white" numberOfLines={1}>
          {firstName}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onBellPress}
        activeOpacity={0.7}
        className="rounded-2xl border border-neutral-800 bg-[#1E1E1E] p-3.5">
        <Bell size={20} color="#FAFAFA" />
        {badgeCount > 0 && (
          <View className="absolute -right-1.5 -top-1.5 h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#EF4444] px-1.5 ring-2 ring-[#0A0A0A]">
            <Text className="font-maisonBold text-[11px] text-white">{badgeCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
