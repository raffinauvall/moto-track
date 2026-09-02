import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ChevronRight, Droplet, Wrench } from 'lucide-react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getService } from '@/api/service/getService';

export default function HistoryMotorScreen() {
  const navigation = useNavigation<any>();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getService();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
      setHistory([]);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  return (
    <ScrollView
      className="flex-1 bg-[#0A0A0A]"
      contentContainerStyle={{ padding: 24, paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}>
      <Text className="mb-6 pt-4 font-maisonBold text-3xl text-white">History Service</Text>

      {loading && <ActivityIndicator size="large" color="#34D399" className="mt-8" />}

      {!loading && history.length === 0 && (
        <View className="mt-20 items-center">
          <View className="rounded-full bg-[#161616] p-6">
            <Wrench size={40} color="#4B5563" />
          </View>
          <Text className="mt-5 text-center font-maison text-lg text-neutral-400">
            Belum ada history service
          </Text>
          <Text className="mt-2 text-center font-maison text-sm text-neutral-500">
            Setelah melakukan service, history akan muncul di sini.
          </Text>
        </View>
      )}

      {!loading &&
        history.map((service) => {
          const isRingan = service.service_type === 'Service Ringan';

          return (
            <TouchableOpacity
              key={service.id}
              onPress={() =>
                navigation.navigate('HistoryMotorDetail', {
                  historyId: service.id,
                  serviceType: service.service_type,
                  serviceDate: service.service_date,
                })
              }
              activeOpacity={0.85}
              className="mb-3 flex-row items-center justify-between rounded-[20px] bg-[#161616] p-4">
              <View className="flex-row items-center">
                <View
                  className={`rounded-xl p-2.5 ${isRingan ? 'bg-[#34D399]/15' : 'bg-[#FBBF24]/15'}`}>
                  {isRingan ? (
                    <Droplet size={24} color="#34D399" />
                  ) : (
                    <Wrench size={24} color="#FBBF24" />
                  )}
                </View>
                <View className="ml-3">
                  <Text className="font-maisonBold text-lg text-white">{service.service_type}</Text>
                  <Text className="mt-0.5 font-maison text-sm text-neutral-500">
                    {new Date(service.service_date).toDateString()}
                  </Text>
                </View>
              </View>
              <ChevronRight size={22} color="#525252" />
            </TouchableOpacity>
          );
        })}
    </ScrollView>
  );
}
