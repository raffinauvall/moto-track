import { View, Text, TouchableOpacity } from "react-native";
import { Bell, Motorbike } from "lucide-react-native";

type MotorHeaderProps = {
  motorName: string;
  onBellPress?: () => void;
};

export default function MotorHeader({ motorName, onBellPress }: MotorHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-8 pt-4">
      <View>
        <Text className="text-gray-500 mb-1">Current Motor</Text>
        <View className="flex-row items-center gap-2">
          <Motorbike size={24} color="#34D399" />
          <Text className="text-white text-2xl font-maisonBold" numberOfLines={1}>
            {motorName}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onBellPress}
        className="p-3 border border-gray-500 rounded-[10px]"
      >
        <Bell size={20} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}
