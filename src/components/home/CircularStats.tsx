import { View, Text } from 'react-native';
import { Svg, Circle, G } from 'react-native-svg';

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
      className="mb-4 items-center rounded-[28px] bg-[#161616] p-4">
      {/* Header */}
      <View className="mb-2 flex-row items-center justify-center gap-2.5">
        <View className="rounded-xl bg-[#1E1E1E] p-2">
          <Icon color={color} size={22} />
        </View>
        <Text className="font-maisonBold text-sm text-white">{label}</Text>
      </View>

      {/* Circle */}
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${center}, ${center}`}>
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#2A2A2A"
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
          <Text className="font-maisonBold text-[22px] text-white">
            {current}/{max}
          </Text>
          <Text className="font-maison text-xs text-neutral-500">km</Text>
        </View>
      </View>
    </View>
  );
}
