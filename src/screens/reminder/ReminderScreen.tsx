import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowLeft, Wrench, BellRing, AlertTriangle } from 'lucide-react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getComponents } from '@/api/motorComponent/getComponents';
import { useActiveMotor } from '@/context/ActiveMotorContext';
import type { MotorComponent } from '@/types';

export default function ReminderScreen({ navigation }: any) {
  const { activeMotor } = useActiveMotor();
  const [components, setComponents] = useState<MotorComponent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComponents = useCallback(async () => {
    if (!activeMotor) {
      setComponents([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getComponents(activeMotor.id);
      setComponents(data || []);
    } catch (error) {
      console.error('Error fetching components:', error);
      setComponents([]);
    } finally {
      setLoading(false);
    }
  }, [activeMotor]);

  useFocusEffect(
    useCallback(() => {
      fetchComponents();
    }, [fetchComponents])
  );

  const dueComponents = components.filter(
    (c) => c.max_value > 0 && c.current_value / c.max_value >= 0.8
  );

  return (
    <View className="flex-1 bg-[#0A0A0A]">
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6 flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="rounded-full border border-neutral-800 bg-[#161616] p-2.5">
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text className="ml-4 font-maisonBold text-xl text-white">Reminder</Text>
        </View>

        {loading && <ActivityIndicator size="large" color="#34D399" className="mt-8" />}

        {!loading && dueComponents.length === 0 && (
          <View className="mt-16 items-center">
            <View className="rounded-full bg-[#161616] p-6">
              <BellRing size={40} color="#4B5563" />
            </View>
            <Text className="mt-5 text-center font-maisonBold text-lg text-white">
              Semua komponen aman
            </Text>
            <Text className="mt-2 text-center font-maison text-sm text-neutral-500">
              Notifikasi bakal muncul pas komponen udah deket batas servis.
            </Text>
          </View>
        )}

        {!loading &&
          dueComponents.map((comp) => {
            const ratio = comp.current_value / comp.max_value;
            return (
              <View
                key={comp.id}
                className="mb-3 rounded-[20px] border border-yellow-500/20 bg-[#161616] p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2.5">
                    <View className="rounded-xl bg-[#FACC15]/10 p-2">
                      <AlertTriangle size={18} color="#FACC15" />
                    </View>
                    <Text className="font-maisonBold text-lg text-white">{comp.name}</Text>
                  </View>
                  <Text className="font-maisonBold text-sm text-yellow-400">
                    {Math.round(ratio * 100)}%
                  </Text>
                </View>
                <View className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#2A2A2A]">
                  <View
                    className="h-full rounded-full bg-[#FACC15]"
                    style={{ width: `${Math.min(ratio * 100, 100)}%` }}
                  />
                </View>
                <Text className="mt-2 font-maison text-sm text-neutral-500">
                  {comp.current_value.toFixed(0)} / {comp.max_value.toFixed(0)} km
                </Text>
              </View>
            );
          })}

        {!loading && dueComponents.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate('ServiceMotor', {
                motorId: activeMotor?.id,
                motorName: activeMotor?.name,
              })
            }
            className="mt-4 flex-row items-center justify-center gap-2 rounded-[24px] bg-[#34D399] py-5">
            <Wrench size={20} color="#052e2b" />
            <Text className="font-maisonBold text-base text-[#052e2b]">Service Sekarang</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
