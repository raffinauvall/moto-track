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
  if (value >= 80) return <CheckCircle size={20} color="#22C55E" />;
  if (value >= 50) return <AlertTriangle size={20} color="#FACC15" />;
  return <XCircle size={20} color="#EF4444" />;
};


export default function MotorScreen({ setIndex }: MotorScreenProps) {
  const navigation = useNavigation<any>();
  const [motors, setMotors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMotors();
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener("focus", fetchMotors);
    return unsub;
  }, [navigation]);

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

      setMotors(motorsWithComponents);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

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
            } catch (err: any) {
              Alert.alert("Error", err.message);
            }
          },
        },
      ]
    );
  };

  const { setActiveMotorState } = useActiveMotor();
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

      <View className="flex-col gap-3 mt-4">
        {motors.map((motor) => {
          const status = getStatus(motor.health ?? 100);

          return (
            <TouchableOpacity
              key={motor.id}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate("MotorDetail", { motor })
              }
              className="w-full bg-[#212121] p-4 rounded-xl"
            >
              {/* HEADER */}
              <View className="flex-row items-center justify-between mb-3">

                {/* NAME + ACTIVE STATUS */}
                <View>
                  <Text className="text-white font-maisonBold text-xl">
                    {motor.name}
                  </Text>

                  <Text className="text-xs text-gray-400">
                    {motor.is_active ? "Active" : "Non-Active"}
                  </Text>
                </View>

                <View className="flex-row items-center gap-3">
                  <View className="flex-row items-center gap-1">
                    <StatusIcon value={motor.health ?? 100} />
                    <Text
                      className="text-xs font-maisonBold"
                      style={{ color: status.color }}
                    >
                      {status.label}
                    </Text>
                  </View>

                  {/* EDIT */}
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("AddEditMotor", {
                        motor,
                        onSave: async (updated: any) => {
                          const components = await getComponents(updated.id);
                          const health = calcHealth(components);

                          setMotors(prev =>
                            prev.map(m =>
                              m.id === updated.id
                                ? { ...updated, components, health }
                                : m
                            )
                          );
                        },
                      })
                    }
                  >
                    <Text className="text-[#FACC15] text-xs font-maisonBold">
                      Edit
                    </Text>
                  </TouchableOpacity>

                  {/* DELETE */}
                  <TouchableOpacity
                    onPress={() => confirmDelete(motor.id, motor.name)}
                  >
                    <Text className="text-[#EF4444] text-xs font-maisonBold">
                      Delete
                    </Text>
                  </TouchableOpacity>

                  {/* SET ACTIVE */}
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

              <MotorHealthBar value={motor.health ?? 100} />

              <Text className="text-xs text-gray-400 mt-2">
                {status.note}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* ADD MOTOR */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate("AddEditMotor", {
              onSave: async (motor: any, tempId?: string) => {
                const components = await getComponents(motor.id);
                const health = calcHealth(components);

                setMotors(prev => {
                  if (tempId) {
                    return prev.map(m =>
                      m.id === tempId
                        ? { ...motor, components, health }
                        : m
                    );
                  }
                  return [{ ...motor, components, health }, ...prev];
                });
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
