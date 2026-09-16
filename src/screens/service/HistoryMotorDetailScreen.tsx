import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useServiceDetails } from '@/hooks/service/useServiceDetails';
import { ChevronLeft, Wrench } from 'lucide-react-native';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(value)
  );

export default function HistoryMotorDetailScreen({ route }: any) {
  const navigation = useNavigation<any>();
  const { historyId, serviceType, serviceDate } = route.params;

  const { details, loading, fetchDetails } = useServiceDetails(historyId);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return (
    <ScrollView
      className="flex-1 bg-[#070B12]"
      contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}>
      {/* Back Button */}
      <TouchableOpacity className="mb-6 flex-row items-center" onPress={() => navigation.goBack()}>
        <View className="rounded-xl border border-[#1F3354] bg-[#0D1728] p-2.5">
          <ChevronLeft size={22} color="#fff" />
        </View>
        <Text className="ml-4 font-maisonBold text-xl text-white">Service detail</Text>
      </TouchableOpacity>

      <View className="mb-7 rounded-2xl border border-[#1F3354] bg-[#0D1728] p-5">
        <View className="flex-row items-center gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10">
            <Wrench size={22} color="#22D3EE" />
          </View>
          <View>
            <Text className="font-maisonBold text-lg text-white">{serviceType}</Text>
            <Text className="mt-1 font-maison text-sm text-slate-500">
              {formatDate(serviceDate)}
            </Text>
          </View>
        </View>
      </View>

      <Text className="mb-3 font-maisonMono text-xs uppercase text-slate-500">
        Components serviced
      </Text>

      {loading && <Text className="text-center font-maison text-slate-400">Loading...</Text>}

      {!loading &&
        details.map((item) => (
          <View key={item.id} className="mb-3 rounded-2xl border border-[#1F3354] bg-[#0D1728] p-4">
            <View className="flex-row items-center justify-between">
              <Text className="font-maisonBold text-white">{item.component_name}</Text>
              <Text className="font-maison text-xs text-slate-500">{item.km_at_service} km</Text>
            </View>
            <Text className="mt-1 font-maison text-xs text-slate-500">
              KM saat service: {item.km_at_service}
            </Text>
          </View>
        ))}
    </ScrollView>
  );
}
