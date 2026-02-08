import { View, Text } from "react-native";

type MotorHealthBarProps = {
  value: number; // 0 - 100
};

export default function MotorHealthBar({ value }: MotorHealthBarProps) {
  const getColor = () => {
    if (value >= 80) return "#22C55E"; 
    if (value >= 50) return "#FACC15"; 
    return "#EF4444"; 
  };

  return (
    <View className="w-full pt-7">
      <View className="flex-row justify-between mb-1">
        <Text className="text-white text-sm font-maison">
          Motor Health
        </Text>
        <Text className="text-gray-400 text-sm">
          {value}%
        </Text>
      </View>

      <View className="h-2 w-full bg-[#2A2A2A] rounded-full overflow-hidden">
        <View
          style={{
            width: `${value}%`,
            backgroundColor: getColor(),
          }}
          className="h-full rounded-full"
        />
      </View>
    </View>
  );
}
