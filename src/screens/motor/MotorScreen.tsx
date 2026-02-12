import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";

import MotorHealthBar from "@/components/motor/MotorHealthBar";
import MotorHeader from "@/components/motor/MotorHeader";
import { useActiveMotor } from "@/context/ActiveMotorContext";

// API
import { GetMotor } from "@/api/motor/getMotor";
import { DeleteMotor } from "@/api/motor/deleteMotor";
import { getComponents } from "@/api/motorComponent/getComponents";
import { setActiveMotor } from "@/api/motor/setActiveMotor";
import { supabase } from "@/api/supabaseClient";

interface MotorScreenProps {
  setIndex: (i: number) => void;
}

/* ================= HELPERS ================= */
const calcHealth = (components: any[]) => {
  if (!components?.length) return 100;

  const ratios = components.map(c =>
    Math.max(0, 1 - c.current_value / c.max_value)
  );

  return Math.round(
    (ratios.reduce((a, b) => a + b, 0) / ratios.length) * 100
  );
};

const getStatus = (value: number) => {
  if (value >= 80)
    return { label: "GOOD", color: "#22C55E", note: "Ready for daily use" };

  if (value >= 50)
    return {
      label: "WARNING",
      color: "#FACC15",
      note: "Maintenance recommended soon",
    };

  return {
    label: "SERVICE",
    color: "#EF4444",
    note: "Immediate service is recommended",
  };
};

const StatusIcon = ({ value }: { value: number }) => {
  if (value >= 80) return <CheckCircle size={18} color="#22C55E" />;
  if (value >= 50) return <AlertTriangle size={18} color="#FACC15" />;
  return <XCircle size={18} color="#EF4444" />;
};

/* ================= SCREEN ================= */
export default function MotorScreen({ setIndex }: MotorScreenProps) {
  const navigation = useNavigation<any>();
  const { setActiveMotorState } = useActiveMotor();

  const [motors, setMotors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMotors();
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener("focus", fetchMotors);
    return unsub;
  }, [navigation]);

  /* ================= FETCH ================= */
  const fetchMotors = async () => {
    setLoading(true);
    try {
      const data = await GetMotor();

      const motorsWithComponents = await Promise.all(
        data.map(async (motor: any) => {
          const components = await getComponents(motor.id);
          const health = calcHealth(components);
          return { ...motor, components, health };
        })
      );

      motorsWithComponents.sort(
        (a, b) => Number(b.is_active) - Number(a.is_active)
      );

      setMotors(motorsWithComponents);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const confirmDelete = (motorId: string, motorName: string) => {
    Alert.alert(
      "Delete Motor",
      `Are you sure you want to delete "${motorName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await DeleteMotor(motorId);

              setMotors(prev => prev.filter(m => m.id !== motorId));

              const deletedActive = motors.find(
                m => m.id === motorId && m.is_active
              );
              if (deletedActive) setActiveMotorState(null);

              Alert.alert("Success", "Motor berhasil dihapus!");
            } catch (err: any) {
              Alert.alert("Error", err.message);
            }
          },
        },
      ]
    );
  };

  /* ================= SET ACTIVE ================= */
  const handleSetActive = async (motor: any) => {
    try {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;

      await setActiveMotor(motor.id, data.user.id);
      setActiveMotorState(motor);

      fetchMotors();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  /* ================= UI ================= */
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 24,
        backgroundColor: "#131313",
      }}
      showsVerticalScrollIndicator={false}
    >
      <MotorHeader motorName="My Motors" />

      {loading && (
        <Text className="text-gray-400 font-maison text-center mt-8">
          Loading motors...
        </Text>
      )}

      <View className="flex-col gap-3 mt-4">
        {motors.map(motor => {
          const status = getStatus(motor.health ?? 100);

          return (
            <View
              key={motor.id}
              className="w-full bg-[#212121] p-4 rounded-xl"
            >
              {/* ===== TAP AREA (DETAIL) ===== */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate("MotorDetail", { motor })
                }
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1 pr-3" style={{ minWidth: 0 }}>
                    <Text
                      className="text-white font-maisonBold text-xl"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {motor.name}
                    </Text>

                    <Text className="text-xs text-gray-400">
                      {motor.is_active ? "Active" : "Non-Active"}
                    </Text>

                    {motor.is_active && (
                      <View className="bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1 self-start">
                        <Text className="text-emerald-400 text-[10px] font-maisonBold">
                          CURRENT MOTOR
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <MotorHealthBar value={motor.health ?? 100} />

                <Text className="text-xs text-gray-400 mt-2 font-maison">
                  {status.note}
                </Text>
              </TouchableOpacity>

              {/* ===== ACTION ROW ===== */}
              <View className="flex-row items-center gap-3 mt-4">
                <View className="flex-row items-center gap-1 mr-auto">
                  <StatusIcon value={motor.health ?? 100} />
                  <Text
                    className="text-xs font-maisonBold"
                    style={{ color: status.color }}
                  >
                    {status.label}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("AddEditMotor", { motor })
                  }
                >
                  <Text className="text-[#FACC15] text-xs font-maisonBold">
                    Edit
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    confirmDelete(motor.id, motor.name)
                  }
                >
                  <Text className="text-[#EF4444] text-xs font-maisonBold">
                    Delete
                  </Text>
                </TouchableOpacity>

                {!motor.is_active && (
                  <TouchableOpacity
                    onPress={() => handleSetActive(motor)}
                  >
                    <Text className="text-[#34D399] text-xs font-maisonBold">
                      Set Active
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}

        {/* ===== ADD MOTOR ===== */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate("AddEditMotor", {
              onSave: async (motor: any) => {
                const components = await getComponents(motor.id);
                const health = calcHealth(components);

                setMotors(prev => [
                  { ...motor, components, health },
                  ...prev,
                ]);
              },
            })
          }
          className="w-full border-2 border-dashed border-neutral-600 p-6 rounded-xl items-center justify-center mt-2"
        >
          <Text className="text-neutral-400 font-maisonBold text-lg">
            + Add New Motor
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
