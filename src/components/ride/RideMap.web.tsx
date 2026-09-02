import { View, Text } from 'react-native';
import { MapPin } from 'lucide-react-native';
import type { RidePoint } from '@/types';

type RideMapProps = {
  points: RidePoint[];
};

// Web fallback: react-native-maps gak support web, jadi tampilkan placeholder.
export default function RideMap({ points }: RideMapProps) {
  return (
    <View className="flex-1 items-center justify-center bg-[#1c1c1c]">
      <MapPin size={36} color="#34D399" />
      <Text className="mt-2 font-maison text-sm text-neutral-400">Map tidak tersedia di web</Text>
      <Text className="font-maison text-xs text-neutral-500">
        {points.length} titik rute tercatat
      </Text>
    </View>
  );
}
