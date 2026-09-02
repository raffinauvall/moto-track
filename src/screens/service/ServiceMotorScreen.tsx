import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { getComponents } from '@/api/motorComponent/getComponents';
import { createService } from '@/api/service/createService';
import { ToastService } from '@/utils/toastService';

export default function ServiceMotorScreen({ route, navigation }: any) {
  const motorId = route?.params?.motorId;
  const motorName = route?.params?.motorName;

  const [components, setComponents] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComponents = async () => {
    try {
      const data = await getComponents(motorId);
      setComponents(data || []);
    } catch {
      Alert.alert('Error', 'Gagal memuat komponen');
    }
  };

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const submitService = async () => {
    if (!selected.length) {
      Alert.alert('Pilih minimal satu komponen');
      return;
    }

    setLoading(true);
    try {
      const serviced = components.filter((c) => selected.includes(c.id));
      const serviceType = serviced.length <= 2 ? 'Service Ringan' : 'Service Berat';

      await createService({
        motorId,
        motorName,
        serviceType,
        components: serviced,
      });

      const updatedComponents = await getComponents(motorId);
      setComponents(updatedComponents || []);

      ToastService.show('success', 'Service berhasil 🚀');
      navigation.goBack();
    } catch {
      ToastService.show('error', 'Gagal menyimpan service');
    } finally {
      setLoading(false);
    }
  };

  if (!motorId) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0A0A0A]">
        <Text className="font-maison text-white">Motor tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0A0A0A]">
      <ScrollView className="px-6 pt-6" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="mb-6 flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="rounded-full border border-neutral-800 bg-[#161616] p-2.5">
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text className="ml-4 font-maisonBold text-xl text-white">Service {motorName}</Text>
        </View>

        <Text className="mb-4 font-maison text-sm text-neutral-500">
          Pilih komponen yang mau diservice
        </Text>

        {components.map((c) => {
          const checked = selected.includes(c.id);
          const ratio = c.max_value > 0 ? c.current_value / c.max_value : 0;
          const color = ratio >= 0.8 ? '#EF4444' : ratio >= 0.5 ? '#FACC15' : '#22C55E';

          return (
            <TouchableOpacity
              key={c.id}
              onPress={() => toggleSelect(c.id)}
              activeOpacity={0.85}
              className={`mb-3 flex-row items-center justify-between rounded-[20px] border p-4 ${
                checked ? 'border-[#34D399] bg-[#34D399]/10' : 'border-neutral-800 bg-[#161616]'
              }`}>
              <View className="flex-1">
                <Text className="font-maisonBold text-white">{c.name}</Text>
                <Text className="mt-1 font-maison text-xs text-neutral-500">
                  {c.current_value} / {c.max_value} km
                </Text>
                <View className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#2A2A2A]">
                  <View
                    className="h-full rounded-full"
                    style={{ width: `${Math.min(ratio * 100, 100)}%`, backgroundColor: color }}
                  />
                </View>
              </View>
              <View
                className={`ml-3 h-6 w-6 items-center justify-center rounded-full border-2 ${
                  checked ? 'border-[#34D399] bg-[#34D399]' : 'border-neutral-600'
                }`}>
                {checked && <Check size={14} color="#052E2B" strokeWidth={3} />}
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          onPress={submitService}
          disabled={loading}
          activeOpacity={0.85}
          className={`mt-6 items-center rounded-[24px] py-5 ${
            selected.length > 0 ? 'bg-[#34D399]' : 'bg-[#2A2A2A]'
          }`}>
          <Text
            className={`font-maisonBold ${selected.length > 0 ? 'text-[#052E2B]' : 'text-[#9CA3AF]'}`}>
            {loading ? 'Menyimpan...' : `Simpan Service (${selected.length})`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
