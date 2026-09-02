import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { CheckCircle, AlertTriangle, XCircle, Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MotorHealthBar from '@/components/motor/MotorHealthBar';
import MotorHeader from '@/components/motor/MotorHeader';
import { useActiveMotor } from '@/context/ActiveMotorContext';
import { calculateHealth, getStatus } from '@/utils/health';

// API
import { getMotor } from '@/api/motor/getMotor';
import { deleteMotor } from '@/api/motor/deleteMotor';
import { getComponents } from '@/api/motorComponent/getComponents';
import { setActiveMotor } from '@/api/motor/setActiveMotor';
import { getCurrentUser } from '@/api';

interface MotorScreenProps {
  setIndex: (i: number) => void;
}

/* ================= ICON STATUS ================= */
const StatusIcon = ({ value }: { value: number }) => {
  if (value >= 80) return <CheckCircle size={18} color="#22C55E" />;
  if (value >= 50) return <AlertTriangle size={18} color="#FACC15" />;
  return <XCircle size={18} color="#EF4444" />;
};

/* ================= SCREEN ================= */
export default function MotorScreen({ setIndex }: MotorScreenProps) {
  const navigation = useNavigation<any>();
  const { setActiveMotorState } = useActiveMotor();
  const insets = useSafeAreaInsets();

  const [motors, setMotors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMotors = async () => {
    setLoading(true);
    try {
      const data = await getMotor();

      const motorsWithComponents = await Promise.all(
        data.map(async (motor: any) => {
          const components = await getComponents(motor.id);
          const health = calculateHealth(components);
          return { ...motor, components, health };
        })
      );

      motorsWithComponents.sort((a, b) => Number(b.is_active) - Number(a.is_active));

      setMotors(motorsWithComponents);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotors();
  }, [fetchMotors]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', fetchMotors);
    return unsub;
  }, [navigation, fetchMotors]);

  const confirmDelete = (motorId: string, motorName: string) => {
    Alert.alert('Delete Motor', `Are you sure you want to delete "${motorName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMotor(motorId);
            setMotors((prev) => prev.filter((m) => m.id !== motorId));
            Alert.alert('Success', 'Motor berhasil dihapus!');
          } catch (err: any) {
            Alert.alert('Error', err.message);
          }
        },
      },
    ]);
  };

  const handleSetActive = async (motor: any) => {
    try {
      const user = await getCurrentUser();
      if (!user) return;

      await setActiveMotor(motor.id, user.id);
      setActiveMotorState(motor);
      fetchMotors();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View className="flex-1 bg-[#0A0A0A]">
      {/* SCROLL AREA */}
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingBottom: insets.bottom + 120, // ruang biar gak ketutup FAB
        }}
        showsVerticalScrollIndicator={false}>
        <MotorHeader motorName="My Motors" onBellPress={() => navigation.navigate('Reminder')} />

        {loading && (
          <Text className="mt-8 text-center font-maison text-neutral-400">Loading motors...</Text>
        )}

        <View className="mt-4 flex-col gap-4">
          {motors.map((motor) => {
            const status = getStatus(motor.health ?? 100);

            return (
              <View
                key={motor.id}
                className="w-full overflow-hidden rounded-[24px] bg-[#161616] p-5"
                style={{
                  borderLeftWidth: 3,
                  borderLeftColor: status.color,
                }}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('MotorDetail', { motor })}>
                  <Text className="font-maisonBold text-xl text-white">{motor.name}</Text>

                  <MotorHealthBar value={motor.health ?? 100} />

                  <Text className="mt-3 text-xs text-neutral-500">{status.note}</Text>
                </TouchableOpacity>

                <View className="mt-4 flex-row items-center gap-3 border-t border-neutral-800 pt-4">
                  <View className="mr-auto flex-row items-center gap-1.5">
                    <StatusIcon value={motor.health ?? 100} />
                    <Text className="font-maisonBold text-xs" style={{ color: status.color }}>
                      {status.label}
                    </Text>
                  </View>

                  <TouchableOpacity onPress={() => navigation.navigate('AddEditMotor', { motor })}>
                    <Text className="font-maisonBold text-xs text-[#FACC15]">Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => confirmDelete(motor.id, motor.name)}>
                    <Text className="font-maisonBold text-xs text-[#EF4444]">Delete</Text>
                  </TouchableOpacity>

                  {!motor.is_active && (
                    <TouchableOpacity onPress={() => handleSetActive(motor)}>
                      <Text className="font-maisonBold text-xs text-[#34D399]">Set Active</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* FLOATING ADD BUTTON */}
      <TouchableOpacity
        onPress={() => navigation.navigate('AddEditMotor')}
        activeOpacity={0.85}
        className="absolute right-6 h-16 w-16 items-center justify-center rounded-full bg-[#34D399] shadow-lg"
        style={{
          bottom: insets.bottom + 90,
          elevation: 8,
        }}>
        <Plus size={26} color="#052E2B" />
      </TouchableOpacity>
    </View>
  );
}
