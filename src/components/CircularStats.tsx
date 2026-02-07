import { View, Text } from "react-native";
import { Droplet, Zap } from "lucide-react-native";
import { Svg, Circle, Text as SvgText, G } from "react-native-svg";

type WidgetProps = {
  current: number;
  max: number;
  label: string;
  color: string;
  Icon: typeof Droplet | typeof Zap;
};

export default function CircularWidget({
  current,
  max,
  label,
  color,
  Icon,
}: WidgetProps) {
  const radius = 48;
  const strokeWidth = 8;
  const size = 160;
  const center = size / 2;

  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / max, 1);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View className="flex-1 bg-[#212121] p-4 rounded-3xl items-center">
      {/* Header */}
      <View className="flex-row items-center justify gap-3 mb-2">
        <Icon className="border" color={color} size={26} />
        <Text className="text-white text-x mt-1">{label}</Text>
      </View>
    

      {/* Progress */}
      <View className="relative" style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${center}, ${center}`}>
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#374151"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
            />
          </G>
        </Svg>

        {/* TEXT OVERLAY */}
        <View className="absolute inset-0 items-center justify-center px-4">
          <Text className="text-white font-bold text-sm text-center">
            {current}/{max}
          </Text>
          <Text className="text-neutral-400 text-[10px]">km</Text>
        </View>
      </View>
    </View>
  );
}
