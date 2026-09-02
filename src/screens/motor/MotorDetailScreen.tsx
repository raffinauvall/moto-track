import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ArrowLeft, Droplet, Zap, Wrench, Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { getComponents } from '@/api/motorComponent/getComponents';
import { toggleComponentPin } from '@/api/motorComponent/toggleComponentPin';
import CircularWidget from '@/components/home/CircularStats';
import { calculateHealth, getStatus } from '@/utils/health';

/* ================= SCREEN ================= */
export default function MotorDetailScreen({ route, navigation }: any) {
  const { motor } = route.params;

  const [components, setComponents] = useState<any[]>([]);
  const [pinnedComponents, setPinnedComponents] = useState<any[]>([]);
  const [health, setHealth] = useState(100);
  const [loading, setLoading] = useState(false);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const data = await getComponents(motor.id);
      setComponents(data || []);
      setPinnedComponents((data || []).filter((c) => c.is_pinned));
      setHealth(calculateHealth(data || []));
    } catch {
      console.log('fetch components error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', fetchComponents);
    return unsub;
  }, [navigation]);

  const togglePin = async (component: any) => {
    const isPinned = pinnedComponents.find((c) => c.id === component.id);

    try {
      if (!isPinned && pinnedComponents.length >= 2) {
        Alert.alert('Maksimal 2 komponen yang bisa dipin');
        return;
      }

      await toggleComponentPin(component);

      fetchComponents();
    } catch (e) {
      Alert.alert('Gagal update pin');
    }
  };

  const status = getStatus(health);

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        {/* ================= HEADER ================= */}
        <View className="mb-6 flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="rounded-full border border-neutral-800 bg-[#161616] p-2.5">
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text className="ml-4 font-maisonBold text-xl text-white">Motor Detail</Text>
        </View>

        {/* ================= MOTOR CARD ================= */}
        <View className="mb-8 overflow-hidden rounded-[28px] bg-[#161616] p-6">
          <View className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-[#34D399] opacity-10" />
          <Text className="font-maisonBold text-2xl text-white">{motor.name}</Text>
          <View className="mt-3 flex-row items-center gap-2">
            <View className="h-2 w-2 rounded-full" style={{ backgroundColor: status.color }} />
            <Text className="font-maison text-sm text-neutral-400">Health: {health}%</Text>
            <Text className="font-maisonBold text-sm" style={{ color: status.color }}>
              {status.label}
            </Text>
          </View>
          <Text className="mt-1 text-xs text-neutral-500">{status.note}</Text>
        </View>

        {/* ================= COMPONENTS ================= */}
        <Text className="mb-4 font-maisonBold text-lg text-white">Components</Text>

        {loading && <Text className="mb-4 font-maison text-neutral-400">Loading...</Text>}

        {!loading && components.length === 0 && (
          <Text className="mb-4 font-maison text-neutral-500">No components found</Text>
        )}

        {/* ================= GRID FIX ================= */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            rowGap: 16,
          }}>
          {components.map((comp) => {
            const Icon = comp.name === 'Oil' ? Droplet : comp.name === 'Spark Plug' ? Zap : Wrench;

            const ratio = 1 - comp.current_value / comp.max_value;
            const color = ratio >= 0.8 ? '#22C55E' : ratio >= 0.5 ? '#FACC15' : '#EF4444';

            const isPinned = pinnedComponents.find((c) => c.id === comp.id);

            return (
              <View
                key={comp.id}
                style={{
                  width: '48%',
                }}>
                {/* 🔥 CLICK KE EDIT */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation.navigate('EditComponent', {
                      component: comp,
                    })
                  }>
                  <View>
                    <CircularWidget
                      current={comp.current_value}
                      max={comp.max_value}
                      label={comp.name}
                      color={color}
                      Icon={Icon}
                    />

                    {/* 📌 PIN BUTTON */}
                    <TouchableOpacity
                      onPress={() => togglePin(comp)}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: isPinned ? '#34D399' : '#1f2937',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 999,
                      }}>
                      <Text
                        className="font-maisonBold text-xs"
                        style={{ color: isPinned ? '#052E2B' : '#fff' }}>
                        {isPinned ? 'Unpin' : 'Pin'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* ================= ADD COMPONENT ================= */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('AddComponent', {
              motorId: motor.id,
            })
          }
          className="mt-6 flex-row items-center justify-center gap-2 rounded-[24px] border border-dashed border-neutral-600 py-5">
          <Plus size={18} color="#9CA3AF" />
          <Text className="font-maisonBold text-neutral-400">Add Component</Text>
        </TouchableOpacity>

        {/* ================= SERVICE MOTOR ================= */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate('ServiceMotor', {
              motorId: motor.id,
              motorName: motor.name,
            })
          }
          className="mt-4 flex-row items-center justify-center gap-2 rounded-[24px] bg-[#34D399] py-5">
          <Wrench size={20} color="#052e2b" />
          <Text className="font-maisonBold text-base text-[#052e2b]">Service Motor</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
