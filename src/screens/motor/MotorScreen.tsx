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

// API
import { GetMotor } from "@/api/motor/getMotor";
import { AddMotor } from "@/api/motor/addMotor";
import { UpdateMotor } from "@/api/motor/updateMotor";
import { DeleteMotor } from "@/api/motor/deleteMotor";

// Helper status
const getStatus = (value: number) => {
  if (value >= 80)
    return { label: "GOOD", color: "#22C55E", note: "Ready for daily use" };
  if (value >= 50)
    return { label: "WARNING", color: "#FACC15", note: "Maintenance recommended soon" };
  return { label: "SERVICE", color: "#EF4444", note: "Immediate service is recommended" };
};

// Status icon
const StatusIcon = ({ value }: { value: number }) => {
  if (value >= 80) return <CheckCircle size={20} color="#22C55E" />;
  if (value >= 50) return <AlertTriangle size={20} color="#FACC15" />;
  return <XCircle size={20} color="#EF4444" />;
};

export default function MotorScreen({ user }: any) {
  const navigation = useNavigation<any>();
  const [motors, setMotors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch motors on mount
  useEffect(() => {
    fetchMotors();
  }, []);

  const fetchMotors = async () => {
    setLoading(true);
    try {
      const data = await GetMotor();
      setMotors(data);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Confirm delete
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

  // Handle add motor (langsung update UI + default components)
  const handleAddMotor = async (motorName: string) => {
    try {
      // Optimistic UI: tambahin sementara
      const tempMotor = {
        id: Date.now(),
        name: motorName,
        health: 100,
      };
      setMotors(prev => [tempMotor, ...prev]);

      // Insert ke Supabase + default components (Oil & Spark Plug)
      const newMotor = await AddMotor(user.id, motorName);

      // Update state dengan ID asli dari DB
      setMotors(prev =>
        prev.map(m => (m.id === tempMotor.id ? newMotor : m))
      );
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
          const status = getStatus(motor.health || 100);

          return (
            <TouchableOpacity
              key={motor.id}
              activeOpacity={0.9}
              onPress={() => navigation.navigate("MotorDetail", { motor })}
              className="w-full bg-[#212121] p-4 rounded-xl"
            >
              {/* HEADER */}
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-white font-maisonBold text-xl">
                  {motor.name}
                </Text>

                <View className="flex-row items-center gap-3">
                  {/* STATUS */}
                  <View className="flex-row items-center gap-1">
                    <StatusIcon value={motor.health || 100} />
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
                          try {
                            const data = await UpdateMotor(
                              updated.id,
                              updated.name
                            );
                            setMotors(prev =>
                              prev.map(m =>
                                m.id === updated.id ? data : m
                              )
                            );
                          } catch (err: any) {
                            Alert.alert("Error", err.message);
                          }
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
                </View>
              </View>

              {/* HEALTH BAR */}
              <MotorHealthBar value={motor.health || 100} />

              {/* NOTE */}
              <Text className="text-xs text-gray-400 mt-2">
                {status.note}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* ADD MOTOR CARD */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            // bisa pakai prompt atau modal untuk input nama motor
            const motorName = "New Motor"; // sementara default
            handleAddMotor(motorName);
          }}
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
