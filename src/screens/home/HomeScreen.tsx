import { View, ScrollView, Text, TouchableOpacity, RefreshControl } from 'react-native';
import Header from '@/components/home/Header';
import MotorCard from '@/components/home/MotorCards';
import PinnedComponents from '@/components/home/PinnedComponents';
import { useActiveMotor } from '@/context/ActiveMotorContext';
import { useEffect, useState, useCallback } from 'react';
import { getCurrentUser } from '@/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useRideTracker } from '@/hooks/motor/useRideTracker';
import { calculateHealth } from '@/utils/health';
import { ChevronRight, History, Navigation2, Square } from 'lucide-react-native';

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
    }, [refreshActiveMotor, reloadComponents])
  );

  /* ================= HEALTH ================= */
  const health = calculateHealth(componentsState);
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
        backgroundColor: '#050B18',
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#22D3EE"
          colors={['#22D3EE']}
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

      {/* Summary */}
      <View className="mb-5 flex-row items-center rounded-2xl border border-[#1F3354] bg-[#0D1728] px-4 py-3.5">
        <View className="flex-1">
          <Text className="font-maisonBold text-xl text-white">
            {health}
            <Text className="text-sm text-slate-500">%</Text>
          </Text>
          <Text className="mt-0.5 font-maison text-xs text-slate-500">Motor health</Text>
        </View>
        <View className="h-8 w-px bg-[#1F3354]" />
        <View className="flex-1 items-center">
          <Text className="font-maisonBold text-xl text-white">{dueCount}</Text>
          <Text className="mt-0.5 font-maison text-xs text-slate-500">Due soon</Text>
        </View>
        <View className="h-8 w-px bg-[#1F3354]" />
        <View className="flex-1 items-end">
          <Text className="font-maisonBold text-xl text-white">{kmCounter.toFixed(1)}</Text>
          <Text className="mt-0.5 font-maison text-xs text-slate-500">Trip km</Text>
        </View>
      </View>

      <PinnedComponents activeMotor={activeMotor} componentsState={componentsState} />

      {/* Ride control */}
      {isRiding ? (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={stopRide}
          style={{
            marginTop: 16,
            borderRadius: 20,
            backgroundColor: '#0D1728',
            borderWidth: 1,
            borderColor: '#EF444450',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 14,
            paddingHorizontal: 20,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {/* Pulsing dot */}
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' }} />
            <Text style={{ fontFamily: 'MaisonNeue-Bold', fontSize: 15, color: '#fff' }}>
              Riding
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text style={{ fontFamily: 'MaisonNeue-Bold', fontSize: 20, color: '#22D3EE' }}>
              {kmCounter.toFixed(2)} km
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                backgroundColor: '#EF4444',
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 999,
              }}>
              <Square size={12} color="#fff" fill="#fff" />
              <Text style={{ fontFamily: 'MaisonNeue-Bold', fontSize: 13, color: '#fff' }}>
                Stop
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!activeMotor}
          onPress={startRide}
          className={`mt-4 flex-row items-center justify-center gap-2.5 rounded-[20px] py-[18px] ${
            activeMotor ? 'bg-cyan-400' : 'bg-[#0D1728]'
          }`}
          style={!activeMotor ? { borderWidth: 1, borderColor: '#1F3354' } : {}}>
          <Navigation2 size={18} color={activeMotor ? '#042F3A' : '#475569'} />
          <Text
            className="font-maisonBold text-base"
            style={{ color: activeMotor ? '#042F3A' : '#475569' }}>
            Start Tracking
          </Text>
        </TouchableOpacity>
      )}

      {/* Ride history */}
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={!activeMotor}
        onPress={() => navigation.navigate('RideHistory')}
        className="mt-3 flex-row items-center justify-between rounded-[20px] border border-[#1F3354] bg-[#0D1728] px-5 py-4">
        <View className="flex-row items-center gap-3">
          <View className="h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10">
            <History size={18} color={activeMotor ? '#22D3EE' : '#64748B'} />
          </View>
          <View>
            <Text
              className="font-maisonBold text-sm"
              style={{ color: activeMotor ? '#fff' : '#64748B' }}>
              Ride History
            </Text>
            <Text className="font-maison text-xs text-slate-500">Lihat riwayat perjalanan</Text>
          </View>
        </View>
        <ChevronRight size={18} color="#374151" />
      </TouchableOpacity>
    </ScrollView>
  );
}
