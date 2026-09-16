import { View, Text, TouchableOpacity } from 'react-native';
import { Motorbike } from 'lucide-react-native';
import MotorHealthBar from '@/components/motor/MotorHealthBar';

type Props = {
  motor: string;
  health?: number;
  onChangeMotor?: () => void;
};

export default function MotorCard({ motor, health = 100, onChangeMotor }: Props) {
  const healthColor = health >= 70 ? '#22C55E' : health >= 40 ? '#FACC15' : '#EF4444';

  return (
    <View
      className="mb-5 rounded-2xl border border-[#1F3354] bg-[#0D1728]"
      style={{ borderTopColor: healthColor }}>
      <View style={{ padding: 18 }}>
        {/* Header row */}
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2.5">
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: '#22D3EE12',
                borderWidth: 1,
                borderColor: '#22D3EE20',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Motorbike color="#22D3EE" size={18} />
            </View>
            <Text style={{ fontFamily: 'MaisonNeue-Book', fontSize: 12, color: '#64748B' }}>
              Active motor
            </Text>
          </View>

          {onChangeMotor && (
            <TouchableOpacity
              onPress={onChangeMotor}
              activeOpacity={0.7}
              style={{
                borderRadius: 999,
                borderWidth: 1,
                borderColor: '#22D3EE30',
                backgroundColor: '#22D3EE0D',
                paddingHorizontal: 12,
                paddingVertical: 5,
              }}>
              <Text style={{ fontFamily: 'MaisonNeue-Bold', fontSize: 11, color: '#22D3EE' }}>
                Switch
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Motor name */}
        <Text
          style={{
            fontFamily: 'MaisonNeue-Bold',
            fontSize: 24,
            lineHeight: 30,
            color: '#fff',
            marginBottom: 4,
          }}
          numberOfLines={1}>
          {motor || 'No Active Motor'}
        </Text>

        {/* Health bar */}
        <MotorHealthBar value={health} />
      </View>
    </View>
  );
}
