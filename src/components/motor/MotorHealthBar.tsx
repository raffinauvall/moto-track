import { View, Text } from 'react-native';

type MotorHealthBarProps = {
  value: number; // 0 - 100
};

export default function MotorHealthBar({ value }: MotorHealthBarProps) {
  const getColor = () => {
    if (value >= 80) return '#22C55E';
    if (value >= 50) return '#FACC15';
    return '#EF4444';
  };

  return (
    <View className="w-full pt-6">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="font-maison text-sm text-neutral-300">Motor Health</Text>
        <View className="flex-row items-center gap-1.5">
          <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: getColor() }} />
          <Text className="font-maisonBold text-sm" style={{ color: getColor() }}>
            {value}%
          </Text>
        </View>
      </View>

      <View className="h-2.5 w-full overflow-hidden rounded-full bg-[#2A2A2A]">
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
