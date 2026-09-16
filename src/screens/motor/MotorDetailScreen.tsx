import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ArrowLeft, Droplet, Zap, Wrench, Plus, Activity } from 'lucide-react-native';
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

  const healthColor =
    health >= 70 ? '#22C55E' : health >= 40 ? '#FACC15' : '#EF4444';

  return (
    <View style={{ flex: 1, backgroundColor: '#050B18' }}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        {/* ================= HEADER ================= */}
        <View className="mb-6 flex-row items-center pt-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: '#1F3354',
              backgroundColor: '#0D1728',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ArrowLeft size={20} color="#94A3B8" />
          </TouchableOpacity>
          <Text className="ml-4 font-maisonBold text-lg text-white">Motor Detail</Text>
        </View>

        {/* ================= MOTOR CARD ================= */}
        <View
          className="mb-6 overflow-hidden rounded-[28px] p-6"
          style={{ backgroundColor: '#0D1728', borderWidth: 1, borderColor: `${healthColor}30` }}>
          {/* Glow blobs */}
          <View
            style={{
              position: 'absolute', top: -30, right: -30,
              width: 120, height: 120, borderRadius: 60,
              backgroundColor: healthColor, opacity: 0.08,
            }}
          />
          <View
            style={{
              position: 'absolute', bottom: -20, left: -20,
              width: 80, height: 80, borderRadius: 40,
              backgroundColor: '#22D3EE', opacity: 0.06,
            }}
          />

          {/* Status row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <View
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 5,
                backgroundColor: `${healthColor}18`,
                borderWidth: 1, borderColor: `${healthColor}35`,
                borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4,
              }}>
              <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: healthColor }} />
              <Text style={{ fontFamily: 'MaisonNeue-Bold', fontSize: 10, color: healthColor }}>
                {status.label.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text className="font-maisonBold text-2xl text-white">{motor.name}</Text>
          <Text style={{ fontSize: 13, color: '#64748B', fontFamily: 'MaisonNeue-Book', marginTop: 2 }}>
            {motor.brand}
          </Text>

          {/* Health meter */}
          <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Activity size={13} color="#64748B" />
                <Text style={{ fontFamily: 'MaisonNeue-Book', fontSize: 12, color: '#64748B' }}>
                  Motor Health
                </Text>
              </View>
              <Text style={{ fontFamily: 'MaisonNeue-Bold', fontSize: 13, color: healthColor }}>
                {health}%
              </Text>
            </View>
            <View style={{ height: 8, backgroundColor: '#0A1929', borderRadius: 4, overflow: 'hidden' }}>
              <View
                style={{
                  width: `${health}%`,
                  height: '100%',
                  backgroundColor: healthColor,
                  borderRadius: 4,
                }}
              />
            </View>
            <Text style={{ fontSize: 11, color: '#475569', marginTop: 6, fontFamily: 'MaisonNeue-Book' }}>
              {status.note}
            </Text>
          </View>
        </View>

        {/* ================= COMPONENTS HEADER ================= */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text className="font-maisonBold text-base text-white">Components</Text>
          <Text style={{ fontSize: 12, color: '#475569', fontFamily: 'MaisonNeue-Book' }}>
            {components.length} parts
          </Text>
        </View>

        {loading && (
          <View style={{ paddingVertical: 32, alignItems: 'center' }}>
            <Text style={{ fontFamily: 'MaisonNeue-Book', fontSize: 14, color: '#475569' }}>Loading...</Text>
          </View>
        )}

        {!loading && components.length === 0 && (
          <View style={{ paddingVertical: 32, alignItems: 'center' }}>
            <Wrench size={32} color="#1F3354" />
            <Text style={{ marginTop: 12, fontFamily: 'MaisonNeue-Book', fontSize: 14, color: '#475569' }}>
              No components yet
            </Text>
          </View>
        )}

        {/* ================= GRID ================= */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            rowGap: 16,
          }}>
          {components.map((comp) => {
            const Icon = comp.name === 'Oil' || comp.name === 'Oli' ? Droplet
              : comp.name === 'Spark Plug' || comp.name === 'Busi' ? Zap
              : Wrench;

            const ratio = 1 - comp.current_value / comp.max_value;
            const color = ratio >= 0.8 ? '#22C55E' : ratio >= 0.5 ? '#FACC15' : '#EF4444';

            const isPinned = pinnedComponents.find((c) => c.id === comp.id);

            return (
              <View
                key={comp.id}
                style={{ width: '48%' }}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation.navigate('EditComponent', { component: comp })
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
                        backgroundColor: isPinned ? '#22D3EE20' : '#0D1728',
                        borderWidth: 1,
                        borderColor: isPinned ? '#22D3EE50' : '#1F3354',
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 999,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'MaisonNeue-Bold',
                          fontSize: 10,
                          color: isPinned ? '#22D3EE' : '#64748B',
                        }}>
                        {isPinned ? '📌 Pinned' : 'Pin'}
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
          onPress={() => navigation.navigate('AddComponent', { motorId: motor.id })}
          style={{
            marginTop: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            borderRadius: 20,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: '#1F3354',
            paddingVertical: 18,
          }}>
          <Plus size={16} color="#475569" />
          <Text style={{ fontFamily: 'MaisonNeue-Bold', fontSize: 13, color: '#475569' }}>
            Add Component
          </Text>
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
          style={{
            marginTop: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            borderRadius: 20,
            backgroundColor: '#22C55E15',
            borderWidth: 1,
            borderColor: '#22C55E35',
            paddingVertical: 18,
          }}>
          <Wrench size={18} color="#22C55E" />
          <Text style={{ fontFamily: 'MaisonNeue-Bold', fontSize: 15, color: '#22C55E' }}>
            Service Motor
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
