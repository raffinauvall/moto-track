import { View, ScrollView, Text, TouchableOpacity, RefreshControl } from 'react-native';
import Header from '@/components/home/Header';
import MotorCard from '@/components/home/MotorCards';
import PinnedComponents from '@/components/home/PinnedComponents';
import { useActiveMotor } from '@/context/ActiveMotorContext';
import { useEffect, useState, useCallback } from 'react';
import { getCurrentUser } from '@/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useRideTracker } from '@/hooks/motor/useRideTracker';
import { calculateHealth, getStatus } from '@/utils/health';
import { ChevronRight, History, Navigation2 } from 'lucide-react-native';

type HomeScreenProps = { setIndex: (i: number) => void };

export default function HomeScreen({ setIndex }: HomeScreenProps) {
  const navigation = useNavigation<any>();
  const { activeMotor, refreshActiveMotor } = useActiveMotor();

  const { isRiding, kmCounter, componentsState, startRide, stopRide, reloadComponents } =
    useRideTracker(activeMotor);

  const [userName, setUserName] = useState('User');
  const [refreshing, setRefreshing] = useState(false);

  /* ================= USER ================= */
  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (user) setUserName(user.user_metadata?.name || 'User');
    })();
  }, []);

  /* ================= RELOAD SAAT BALIK KE HOME ================= */
  useFocusEffect(
    useCallback(() => {
      refreshActiveMotor();
      reloadComponents?.();
    }, [activeMotor])
  );

  /* ================= HEALTH ================= */
  const health = calculateHealth(componentsState);
  const status = getStatus(health);
  const dueCount = componentsState.filter(
    (c) => c.max_value > 0 && c.current_value / c.max_value >= 0.8
  ).length;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshActiveMotor();
    await reloadComponents?.();
    setRefreshing(false);
  }, [refreshActiveMotor, reloadComponents]);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 24,
        paddingBottom: 140,
        backgroundColor: '#0A0A0A',
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#34D399"
          colors={['#34D399']}
        />
      }>
      <Header
        name={userName}
        badgeCount={dueCount}
        onBellPress={() => navigation.navigate('Reminder')}
      />

      <MotorCard
        motor={activeMotor?.name || 'No Active Motor'}
        health={health}
        onChangeMotor={() => setIndex(1)}
      />

      {/* Status pill */}
      <View className="mb-1 mt-1 flex-row items-center gap-2.5 self-start rounded-full border border-neutral-800 bg-[#161616] px-4 py-2.5">
        <View className="h-2 w-2 rounded-full" style={{ backgroundColor: status.color }} />
        <Text className="font-maisonBold text-sm" style={{ color: status.color }}>
          {status.label}
        </Text>
        <Text className="font-maison text-xs text-neutral-500">• {status.note}</Text>
      </View>

      <PinnedComponents activeMotor={activeMotor} componentsState={componentsState} />

      {/* Ride control */}
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={!activeMotor}
        onPress={isRiding ? stopRide : startRide}
        className={`mt-4 flex-row items-center justify-center gap-2.5 rounded-[20px] py-4 ${
          isRiding ? 'bg-[#EF4444]' : activeMotor ? 'bg-[#34D399] shadow-glow' : 'bg-[#2A2A2A]'
        }`}>
        <Navigation2 size={18} color={isRiding ? '#fff' : activeMotor ? '#052E2B' : '#9CA3AF'} />
        <Text
          className="font-maisonBold text-base"
          style={{
            color: isRiding ? '#fff' : activeMotor ? '#052E2B' : '#9CA3AF',
          }}>
          {isRiding ? `Stop • ${kmCounter.toFixed(2)} km` : 'Start Tracking'}
        </Text>
      </TouchableOpacity>

      {/* Ride history */}
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={!activeMotor}
        onPress={() => navigation.navigate('RideHistory')}
        className="mt-3 flex-row items-center justify-between rounded-[20px] border border-neutral-800 bg-[#161616] px-5 py-4">
        <View className="flex-row items-center gap-3">
          <View className="rounded-xl bg-[#34D399]/10 p-2.5">
            <History size={18} color={activeMotor ? '#34D399' : '#9CA3AF'} />
          </View>
          <View>
            <Text
              className="font-maisonBold text-base"
              style={{ color: activeMotor ? '#FAFAFA' : '#9CA3AF' }}>
              Ride History
            </Text>
            <Text className="font-maison text-xs text-neutral-500">Lihat riwayat perjalanan</Text>
          </View>
        </View>
        <ChevronRight size={20} color="#525252" />
      </TouchableOpacity>
    </ScrollView>
  );
}
