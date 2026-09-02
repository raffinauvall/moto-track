import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowLeft, Route, Clock, Flag } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import RideMap from '@/components/ride/RideMap';
import { getRidePoints } from '@/api/ride/ridePoints';
import type { Ride, RidePoint } from '@/types';

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h} jam ${m} menit`;
  if (m > 0) return `${m} menit ${s} detik`;
  return `${s} detik`;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function RideDetailScreen({ route, navigation }: any) {
  const { ride } = route.params as { ride: Ride };
  const [points, setPoints] = useState<RidePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getRidePoints(ride.id);
        setPoints(data || []);
      } catch (error) {
        console.error('Error fetching ride points:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [ride.id]);

  const coordinates = points.map((p) => ({
    latitude: p.latitude,
    longitude: p.longitude,
  }));

  const hasRoute = coordinates.length >= 2;

  return (
    <View className="flex-1 bg-[#0A0A0A]">
      {/* Header */}
      <View className="flex-row items-center px-6 pb-4 pt-6">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="rounded-full border border-neutral-800 bg-[#161616] p-2.5">
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>
        <Text className="ml-4 font-maisonBold text-xl text-white">Ride Detail</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        {/* Map */}
        {loading ? (
          <View className="h-64 items-center justify-center rounded-[28px] bg-[#161616]">
            <ActivityIndicator size="large" color="#34D399" />
          </View>
        ) : hasRoute ? (
          <View className="mb-6 h-72 overflow-hidden rounded-[28px]">
            <RideMap points={points} />
          </View>
        ) : (
          <View className="mb-6 h-40 items-center justify-center rounded-[28px] bg-[#161616]">
            <Route size={36} color="#4B5563" />
            <Text className="mt-2 font-maison text-neutral-400">Belum ada data rute</Text>
          </View>
        )}

        {/* Info card */}
        <View className="mb-6 rounded-[28px] bg-[#161616] p-6">
          <Text className="font-maison text-xs text-neutral-500">
            {formatDate(ride.start_time)}
          </Text>
          <View className="mt-2 flex-row items-baseline gap-1.5">
            <Text className="font-maisonBold text-4xl text-white">{ride.distance.toFixed(2)}</Text>
            <Text className="font-maison text-base text-neutral-500">km</Text>
          </View>
          <View className="mt-6 flex-row justify-between border-t border-neutral-800 pt-5">
            <View className="flex-1">
              <View className="flex-row items-center gap-1.5">
                <Clock size={14} color="#34D399" />
                <Text className="font-maison text-xs text-neutral-500">Durasi</Text>
              </View>
              <Text className="mt-1.5 font-maison text-sm text-white">
                {formatDuration(ride.duration)}
              </Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-1.5">
                <Flag size={14} color="#FACC15" />
                <Text className="font-maison text-xs text-neutral-500">Start</Text>
              </View>
              <Text className="mt-1.5 font-maison text-sm text-white">
                {new Date(ride.start_time).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-1.5">
                <Flag size={14} color="#EF4444" />
                <Text className="font-maison text-xs text-neutral-500">Finish</Text>
              </View>
              <Text className="mt-1.5 font-maison text-sm text-white">
                {new Date(ride.end_time).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
