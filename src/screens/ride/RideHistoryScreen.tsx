import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowLeft, Route, ChevronRight, MapPin } from 'lucide-react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getRides } from '@/api/ride/getRides';
import { useActiveMotor } from '@/context/ActiveMotorContext';
import type { Ride } from '@/types';

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}j ${m}m`;
  if (m > 0) return `${m}m ${s}d`;
  return `${s}d`;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function RideHistoryScreen({ navigation }: any) {
  const { activeMotor } = useActiveMotor();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRides = useCallback(async () => {
    if (!activeMotor) {
      setRides([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getRides(activeMotor.id);
      setRides(data || []);
    } catch (error) {
      console.error('Error fetching rides:', error);
      setRides([]);
    } finally {
      setLoading(false);
    }
  }, [activeMotor]);

  useFocusEffect(
    useCallback(() => {
      fetchRides();
    }, [fetchRides])
  );

  const totalKm = rides.reduce((acc, r) => acc + (r.distance || 0), 0);

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
          <Text className="ml-4 font-maisonBold text-xl text-white">Ride History</Text>
        </View>

        {/* Summary card */}
        <View className="mb-6 overflow-hidden rounded-[28px] bg-[#161616] p-6">
          <View className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-[#34D399] opacity-10" />
          <View className="flex-row items-center gap-2.5">
            <View className="rounded-xl bg-[#34D399]/15 p-2">
              <Route size={20} color="#34D399" />
            </View>
            <Text className="font-maison text-sm text-neutral-400">
              {activeMotor?.name || 'Motor'}
            </Text>
          </View>
          <Text className="mt-4 font-maisonBold text-5xl text-white">{totalKm.toFixed(2)} km</Text>
          <Text className="mt-2 font-maison text-sm text-neutral-500">
            Total jarak dari {rides.length} ride
          </Text>
        </View>

        {loading && <ActivityIndicator size="large" color="#34D399" className="mt-8" />}

        {!loading && rides.length === 0 && (
          <View className="mt-16 items-center">
            <View className="rounded-full bg-[#161616] p-6">
              <Route size={40} color="#4B5563" />
            </View>
            <Text className="mt-5 text-center font-maisonBold text-lg text-white">
              Belum ada ride
            </Text>
            <Text className="mt-2 text-center font-maison text-sm text-neutral-500">
              Mulai tracking dari halaman Home buat catat jarak tempuhmu.
            </Text>
          </View>
        )}

        {!loading &&
          rides.map((ride) => (
            <TouchableOpacity
              key={ride.id}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('RideDetail', { ride })}
              className="mb-3 flex-row items-center justify-between rounded-[20px] bg-[#161616] p-4">
              <View className="flex-1">
                <Text className="font-maison text-xs text-neutral-500">
                  {formatDate(ride.start_time)}
                </Text>
                <View className="mt-2 flex-row items-center justify-between">
                  <View className="flex-row items-baseline gap-1">
                    <Text className="font-maisonBold text-xl text-white">
                      {ride.distance.toFixed(2)}
                    </Text>
                    <Text className="font-maison text-xs text-neutral-500">km</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <MapPin size={12} color="#737373" />
                    <Text className="font-maison text-sm text-neutral-400">
                      {formatDuration(ride.duration)}
                    </Text>
                  </View>
                </View>
              </View>
              <ChevronRight size={22} color="#525252" className="ml-2" />
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
}
