import { View, Text } from 'react-native';
import { Svg, Circle, G } from 'react-native-svg';

type WidgetProps = {
  current: number;
  max: number;
  label: string;
  color: string;
  Icon: any;
  style?: any;
};

export default function CircularWidget({
  current,
  max,
  label,
  color,
  Icon,
  style,
}: WidgetProps) {
  const radius = 46;
  const strokeWidth = 7;
  const size = 150;
  const center = size / 2;

  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / max, 1);
  const strokeDashoffset = circumference * (1 - progress);

  const pct = Math.round(progress * 100);

  return (
    <View
      style={[
        {
          alignItems: 'center',
          borderRadius: 22,
          borderWidth: 1,
          borderColor: `${color}25`,
          backgroundColor: '#0D1728',
          padding: 14,
          marginBottom: 4,
          overflow: 'hidden',
        },
        style,
      ]}>
      {/* Subtle glow blob */}
      <View
        style={{
          position: 'absolute', top: -20, right: -20,
          width: 80, height: 80, borderRadius: 40,
          backgroundColor: color, opacity: 0.06,
        }}
      />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8, width: '100%' }}>
        <View
          style={{
            width: 30, height: 30, borderRadius: 8,
            backgroundColor: `${color}18`,
            borderWidth: 1, borderColor: `${color}25`,
            alignItems: 'center', justifyContent: 'center',
          }}>
          <Icon color={color} size={16} />
        </View>
        <Text
          style={{
            fontFamily: 'MaisonNeue-Bold',
            fontSize: 12,
            color: '#E2E8F0',
            flex: 1,
          }}
          numberOfLines={1}>
          {label}
        </Text>
      </View>

      {/* Circle */}
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${center}, ${center}`}>
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#0A1929"
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

        {/* Center text */}
        <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: 'MaisonNeue-Bold', fontSize: 20, color: '#fff' }}>
            {pct}<Text style={{ fontSize: 12, color: '#64748B' }}>%</Text>
          </Text>
          <Text style={{ fontFamily: 'MaisonNeue-Book', fontSize: 10, color: '#475569', marginTop: 2 }}>
            {current}/{max} km
          </Text>
        </View>
      </View>
    </View>
  );
}
