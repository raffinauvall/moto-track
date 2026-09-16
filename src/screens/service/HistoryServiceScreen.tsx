import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ChevronRight, Wrench } from 'lucide-react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getService } from '@/api/service/getService';
import type { ServiceHistory } from '@/types';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(value)
  );

export default function HistoryMotorScreen() {
  const navigation = useNavigation<any>();
  const [history, setHistory] = useState<ServiceHistory[]>([]);
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
      className="flex-1 bg-[#070B12]"
      contentContainerStyle={{ padding: 24, paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}>
      <View className="mb-7 flex-row items-end justify-between pt-4">
        <View>
          <Text className="mb-1 font-maisonMono text-xs uppercase text-slate-500">Service log</Text>
          <Text className="font-maisonBold text-3xl text-white">History service</Text>
        </View>
        {!loading && history.length > 0 && (
          <Text className="font-maison text-sm text-slate-500">{history.length} records</Text>
        )}
      </View>

      {loading && <ActivityIndicator size="small" color="#22D3EE" className="mt-8" />}

      {!loading && history.length === 0 && (
        <View className="mt-16 items-center rounded-2xl border border-[#1F3354] bg-[#0D1728] px-6 py-10">
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10">
            <Wrench size={24} color="#22D3EE" />
          </View>
          <Text className="mt-4 text-center font-maisonBold text-base text-white">
            Belum ada service
          </Text>
          <Text className="mt-2 text-center font-maison text-sm leading-5 text-slate-500">
            Setelah melakukan service, history akan muncul di sini.
          </Text>
        </View>
      )}

      {!loading &&
        history.map((service) => {
          const isRingan = service.service_type === 'Service Ringan';
          const accent = isRingan ? '#22D3EE' : '#FACC15';

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
              className="mb-3 flex-row items-center justify-between rounded-2xl border border-[#1F3354] bg-[#0D1728] p-4"
              style={{ borderLeftWidth: 3, borderLeftColor: accent }}>
              <View className="flex-1 flex-row items-center">
                <View
                  className="h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${accent}18` }}>
                  <Wrench size={19} color={accent} />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="font-maisonBold text-base text-white">
                    {service.service_type}
                  </Text>
                  <Text className="mt-1 font-maison text-xs text-slate-500">
                    {formatDate(service.service_date)}
                    {service.total_components ? `  ·  ${service.total_components} komponen` : ''}
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
