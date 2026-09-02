import MapView, { Polyline, Marker } from 'react-native-maps';
import type { RidePoint } from '@/types';

type RideMapProps = {
  points: RidePoint[];
};

export default function RideMap({ points }: RideMapProps) {
  const coordinates = points.map((p) => ({
    latitude: p.latitude,
    longitude: p.longitude,
  }));

  if (coordinates.length < 2) return null;

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: coordinates[0].latitude,
        longitude: coordinates[0].longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}>
      <Polyline coordinates={coordinates} strokeColor="#34D399" strokeWidth={4} />
      <Marker coordinate={coordinates[0]} title="Start" pinColor="#22C55E" />
      <Marker coordinate={coordinates[coordinates.length - 1]} title="Finish" pinColor="#EF4444" />
    </MapView>
  );
}
