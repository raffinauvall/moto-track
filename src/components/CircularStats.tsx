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
  const radius = 36;
  const strokeWidth = 6;
  const center = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / max, 1);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View className="flex-1 bg-[#212121] p-4 rounded-3xl items-center justify-between">
      {/* Header */}
      <View className="items-center">
        <Icon color={color} size={26} />
        <Text className="text-neutral-400 text-xs mt-1">{label}</Text>
      </View>

      {/* Progress */}

      <Svg width={150} height={150}>
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

        <SvgText
          x={center}
          y={center}
          fontSize="12"
          fontWeight="bold"
          fill="white"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {`${current}/${max} km`}
        </SvgText>
      </Svg>
    </View>
  );
}
