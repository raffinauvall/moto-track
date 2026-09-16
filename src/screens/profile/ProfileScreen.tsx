import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { LogOut, Bike, Wrench, ChevronRight, Settings } from 'lucide-react-native';
import { getMotor } from '@/api/motor/getMotor';
import { getService } from '@/api/service/getService';
import { getCurrentUser, signOut } from '@/api';
import type { AppUser } from '@/types';

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [motorCount, setMotorCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        const motors = await getMotor();
        setMotorCount(motors.length);

        const service = await getService();
        setServiceCount(service.length);
      } catch (err: any) {
        Alert.alert('Error', err.message);
      }
    };

    init();
  }, []);

  const handleLogout = async () => {
    await signOut();

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-[#050B18]">
        <ActivityIndicator size="large" color="#22D3EE" />
      </View>
    );
  }

  const displayName = user.user_metadata?.name || 'Rider';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <ScrollView
      className="flex-1 bg-[#050B18]"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}>
      {/* ── HEADER ── */}
      <View
        style={{
          paddingTop: 60,
          paddingBottom: 36,
          paddingHorizontal: 24,
          backgroundColor: '#0D1728',
          borderBottomWidth: 1,
          borderBottomColor: '#1F3354',
          overflow: 'hidden',
        }}>
        {/* Glow */}
        <View
          style={{
            position: 'absolute', top: -40, right: -40,
            width: 180, height: 180, borderRadius: 90,
            backgroundColor: '#22D3EE', opacity: 0.05,
          }}
        />

        <View style={{ alignItems: 'center' }}>
          {/* Avatar with ring */}
          <View
            style={{
              width: 96, height: 96, borderRadius: 48,
              borderWidth: 2, borderColor: '#22D3EE40',
              backgroundColor: '#0A1929',
              alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
            }}>
            <Image
              source={{ uri: `https://i.pravatar.cc/200?u=${user.id}` }}
              style={{ width: 88, height: 88, borderRadius: 44 }}
            />
          </View>

          <Text style={{ fontFamily: 'MaisonNeue-Bold', fontSize: 22, color: '#fff', marginBottom: 4 }}>
            {displayName}
          </Text>
          <Text style={{ fontFamily: 'MaisonNeue-Book', fontSize: 13, color: '#64748B' }}>
            {user.email}
          </Text>

          {/* Online indicator */}
          <View
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 5,
              marginTop: 10,
              backgroundColor: '#22C55E12',
              borderWidth: 1, borderColor: '#22C55E30',
              borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4,
            }}>
            <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: '#22C55E' }} />
            <Text style={{ fontFamily: 'MaisonNeue-Bold', fontSize: 10, color: '#22C55E' }}>Active</Text>
          </View>
        </View>
      </View>

      {/* ── STATS ── */}
      <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 24, marginTop: 24 }}>
        <View
          style={{
            flex: 1, borderRadius: 20, borderWidth: 1,
            borderColor: '#1F3354', backgroundColor: '#0D1728', padding: 18,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <View
              style={{
                width: 36, height: 36, borderRadius: 10,
                backgroundColor: '#22C55E12', borderWidth: 1, borderColor: '#22C55E20',
                alignItems: 'center', justifyContent: 'center',
              }}>
              <Bike color="#22C55E" size={18} />
            </View>
            <Text style={{ fontFamily: 'MaisonNeue-Bold', fontSize: 28, color: '#fff' }}>
              {motorCount}
            </Text>
          </View>
          <Text style={{ fontFamily: 'MaisonNeue-Book', fontSize: 12, color: '#64748B' }}>
            Total Motors
          </Text>
        </View>

        <View
          style={{
            flex: 1, borderRadius: 20, borderWidth: 1,
            borderColor: '#1F3354', backgroundColor: '#0D1728', padding: 18,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <View
              style={{
                width: 36, height: 36, borderRadius: 10,
                backgroundColor: '#22D3EE12', borderWidth: 1, borderColor: '#22D3EE20',
                alignItems: 'center', justifyContent: 'center',
              }}>
              <Wrench color="#22D3EE" size={18} />
            </View>
            <Text style={{ fontFamily: 'MaisonNeue-Bold', fontSize: 28, color: '#fff' }}>
              {serviceCount}
            </Text>
          </View>
          <Text style={{ fontFamily: 'MaisonNeue-Book', fontSize: 12, color: '#64748B' }}>
            Services Done
          </Text>
        </View>
      </View>

      {/* ── LOGOUT ── */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          marginHorizontal: 24,
          marginTop: 32,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#EF444425',
          backgroundColor: '#0D1728',
          paddingHorizontal: 20,
          paddingVertical: 16,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 36, height: 36, borderRadius: 10,
              backgroundColor: '#EF444412',
              alignItems: 'center', justifyContent: 'center',
            }}>
            <LogOut size={17} color="#EF4444" />
          </View>
          <Text style={{ fontFamily: 'MaisonNeue-Bold', fontSize: 15, color: '#EF4444' }}>
            Logout
          </Text>
        </View>
        <ChevronRight size={16} color="#EF444460" />
      </TouchableOpacity>
    </ScrollView>
  );
}
