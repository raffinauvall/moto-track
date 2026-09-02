import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useServiceDetails } from '@/hooks/service/useServiceDetails';
import { ChevronLeft, Wrench } from 'lucide-react-native';

export default function HistoryMotorDetailScreen({ route }: any) {
  const navigation = useNavigation<any>();
  const { historyId, serviceType, serviceDate } = route.params;

  const { details, loading, fetchDetails } = useServiceDetails(historyId);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const isRingan = serviceType === 'Service Ringan';

  return (
    <ScrollView
      className="flex-1 bg-[#0A0A0A]"
      contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}>
      {/* Back Button */}
      <TouchableOpacity className="mb-6 flex-row items-center" onPress={() => navigation.goBack()}>
        <View className="rounded-full border border-neutral-800 bg-[#161616] p-2.5">
          <ChevronLeft size={22} color="#fff" />
        </View>
        <Text className="ml-4 font-maisonBold text-xl text-white">Detail Service</Text>
      </TouchableOpacity>

      <View className="mb-6 rounded-[28px] bg-[#161616] p-6">
        <View className="flex-row items-center gap-3">
          <View className={`rounded-xl p-3 ${isRingan ? 'bg-[#34D399]/15' : 'bg-[#FBBF24]/15'}`}>
            <Wrench size={24} color={isRingan ? '#34D399' : '#FBBF24'} />
          </View>
          <View>
            <Text className="font-maisonBold text-xl text-white">{serviceType}</Text>
            <Text className="mt-1 font-maison text-sm text-neutral-500">
              {new Date(serviceDate).toDateString()}
            </Text>
          </View>
        </View>
      </View>

      <Text className="mb-4 font-maisonBold text-lg text-white">Komponen Diservice</Text>

      {loading && <Text className="text-center font-maison text-neutral-400">Loading...</Text>}

      {!loading &&
        details.map((item) => (
          <View key={item.id} className="mb-3 rounded-[20px] bg-[#161616] p-4">
            <View className="flex-row items-center justify-between">
              <Text className="font-maisonBold text-white">{item.component_name}</Text>
              <Text className="font-maison text-xs text-neutral-500">{item.km_at_service} km</Text>
            </View>
            <Text className="mt-1 font-maison text-sm text-neutral-500">
              KM saat service: {item.km_at_service}
            </Text>
          </View>
        ))}
    </ScrollView>
  );
}
