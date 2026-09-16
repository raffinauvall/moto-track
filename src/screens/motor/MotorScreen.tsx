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
    <View className="flex-1 bg-[#050B18]">
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
                className="w-full overflow-hidden rounded-[24px] bg-[#0D1728]"
                style={{
                  borderWidth: 1,
                  borderColor: motor.is_active ? `${status.color}40` : '#1F3354',
                }}>
                {/* Active badge */}
                {motor.is_active && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      backgroundColor: '#22D3EE18',
                      borderWidth: 1,
                      borderColor: '#22D3EE40',
                      borderRadius: 999,
                      paddingHorizontal: 10,
                      paddingVertical: 3,
                    }}>
                    <Text style={{ fontFamily: 'MaisonNeue-Bold', fontSize: 10, color: '#22D3EE' }}>
                      ACTIVE
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('MotorDetail', { motor })}
                  style={{ padding: 20 }}>
                  {/* Status strip */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: status.color }} />
                    <Text style={{ fontFamily: 'MaisonNeue-Bold', fontSize: 11, color: status.color }}>
                      {status.label}
                    </Text>
                  </View>

                  <Text className="font-maisonBold text-xl text-white">{motor.name}</Text>
                  <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2, fontFamily: 'MaisonNeue-Book' }}>
                    {motor.brand}
                  </Text>

                  <MotorHealthBar value={motor.health ?? 100} />
                </TouchableOpacity>

                {/* Action footer */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderTopWidth: 1,
                    borderTopColor: '#1A2C47',
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    gap: 6,
                  }}>
                  {/* Edit */}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('AddEditMotor', { motor })}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 5,
                      backgroundColor: '#FACC1515',
                      borderWidth: 1,
                      borderColor: '#FACC1530',
                      borderRadius: 999,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                    }}>
                    <Text style={{ fontFamily: 'MaisonNeue-Bold', fontSize: 11, color: '#FACC15' }}>Edit</Text>
                  </TouchableOpacity>

                  {/* Delete */}
                  <TouchableOpacity
                    onPress={() => confirmDelete(motor.id, motor.name)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 5,
                      backgroundColor: '#EF444415',
                      borderWidth: 1,
                      borderColor: '#EF444430',
                      borderRadius: 999,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                    }}>
                    <Text style={{ fontFamily: 'MaisonNeue-Bold', fontSize: 11, color: '#EF4444' }}>Delete</Text>
                  </TouchableOpacity>

                  {/* Set Active */}
                  {!motor.is_active && (
                    <TouchableOpacity
                      onPress={() => handleSetActive(motor)}
                      style={{
                        marginLeft: 'auto',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        backgroundColor: '#22D3EE15',
                        borderWidth: 1,
                        borderColor: '#22D3EE35',
                        borderRadius: 999,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                      }}>
                      <Text style={{ fontFamily: 'MaisonNeue-Bold', fontSize: 11, color: '#22D3EE' }}>Set Active</Text>
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
        className="absolute right-6 h-16 w-16 items-center justify-center rounded-full bg-cyan-400 shadow-lg"
        style={{
          bottom: insets.bottom + 90,
          elevation: 8,
        }}>
        <Plus size={26} color="#042F3A" />
      </TouchableOpacity>
    </View>
  );
}
