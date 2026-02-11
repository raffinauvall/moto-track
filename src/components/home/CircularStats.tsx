import { View, Text, useWindowDimensions } from "react-native";
import { Svg, Circle, G } from "react-native-svg";

type WidgetProps = {
  current: number;
  max: number;
  label: string;
  color: string;
  Icon: any;
  size?: number;
  style?: any;
};

export default function CircularWidget({
  current,
  max,
  label,
  color,
  Icon,
  size,
  style,
}: WidgetProps) {
  const { width: screenWidth } = useWindowDimensions();
  const widgetSize = size || Math.min(screenWidth * 0.4, 160);

  const padding = widgetSize * 0.11;
  const strokeWidth = widgetSize * 0.057;
  const svgSize = widgetSize - padding * 2;
  const radius = (svgSize - strokeWidth) / 2;
  const center = svgSize / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = max > 0 ? Math.min(current / max, 1) : 0;
  const strokeDashoffset = circumference * (1 - progress);

  const iconSize = widgetSize * 0.18;
  const labelFontSize = Math.max(widgetSize * 0.086, 10);
  const valueFontSize = Math.max(widgetSize * 0.13, 12);
  const unitFontSize = Math.max(widgetSize * 0.08, 10);

  return (
    <View
      className="bg-[#212121] rounded-3xl items-center"
      style={[{ padding }, style]}
    >
      {/* Label & Icon */}
      <View className="flex-row items-center justify-center gap-x-1 mb-1">
        <Icon color={color} size={iconSize} />
        <Text
          className="text-white font-medium"
          numberOfLines={1}
          style={{ fontSize: labelFontSize }}
        >
          {label}
        </Text>
      </View>

      {/* Circular Progress */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Svg width={svgSize} height={svgSize}>
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

        {/* Center Text */}
        <View
          className="absolute items-center justify-center"
          style={{ width: svgSize, height: svgSize }}
        >
          <Text
            className="text-white font-bold"
            style={{ fontSize: valueFontSize, lineHeight: valueFontSize * 1.2 }}
          >
            {current}/{max}
          </Text>
          <Text
            className="text-neutral-400"
            style={{ fontSize: unitFontSize }}
          >
            km
          </Text>
        </View>
      </View>
    </View>
    
  );
}