import { View, Text } from 'react-native';

type MotorHealthBarProps = {
  value: number; // 0 - 100
};

export default function MotorHealthBar({ value }: MotorHealthBarProps) {
  const getColor = () => {
    if (value >= 70) return '#22C55E';
    if (value >= 40) return '#FACC15';
    return '#EF4444';
  };

  const color = getColor();

  return (
    <View style={{ width: '100%', paddingTop: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ fontFamily: 'MaisonNeue-Book', fontSize: 12, color: '#64748B' }}>
          Motor Health
        </Text>
        <Text style={{ fontFamily: 'MaisonNeue-Bold', fontSize: 13, color }}>
          {value}%
        </Text>
      </View>

      {/* Track */}
      <View style={{ height: 6, width: '100%', backgroundColor: '#0A1929', borderRadius: 3, overflow: 'hidden' }}>
        {/* Fill */}
        <View
          style={{
            width: `${value}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: 3,
            opacity: 0.9,
          }}
        />
      </View>
    </View>
  );
}
