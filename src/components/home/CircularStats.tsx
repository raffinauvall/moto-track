import { View, Text } from "react-native";
import { Svg, Circle, G } from "react-native-svg";

type WidgetProps = {
  current: number;
  max: number;
  label: string;
  color: string;
  Icon: any;
};

export default function CircularWidget({
  current,
  max,
  label,
  color,
  Icon,
  style, // tambahin prop style
}: WidgetProps & { style?: any }) {
  const radius = 48;
  const strokeWidth = 8;
  const size = 160;
  const center = size / 2;

  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / max, 1);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View
      style={style} // pake style dari luar
      className="bg-[#212121] p-4 rounded-3xl items-center mb-4"
    >
      {/* Header */}
      <View className="flex-row items-center justify-center gap-3 mb-2">
        <Icon color={color} size={26} />
        <Text className="text-white text-xs">{label}</Text>
      </View>

      {/* Circle */}
      <View style={{ width: size, height: size }}>
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

        {/* Text */}
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-white font-bold">
            {current}/{max}
          </Text>
          <Text className="text-neutral-400 text-xs">km</Text>
        </View>
      </View>
    </View>
  );
}
