import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { ArrowLeft, Droplet, Zap, Wrench, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { getComponents } from "@/api/motorComponent/getComponents";
import CircularWidget from "@/components/home/CircularStats";
import { supabase } from "@/api/supabaseClient";

// ================= helpers =================
const getStatus = (value: number) => {
  if (value >= 80)
    return { label: "GOOD", color: "#22C55E", note: "Ready for daily use" };
  if (value >= 50)
    return { label: "WARNING", color: "#FACC15", note: "Maintenance soon" };
  return { label: "SERVICE", color: "#EF4444", note: "Service now" };
};

const calcHealth = (components: any[]) => {
  if (!components?.length) return 100;
  const ratios = components.map((c) =>
    Math.max(0, 1 - c.current_value / c.max_value)
  );
  return Math.round((ratios.reduce((a, b) => a + b, 0) / ratios.length) * 100);
};

// ================= screen =================
export default function MotorDetailScreen({ route, navigation }: any) {
  const { motor, onRefreshPinned } = route.params;

  const [components, setComponents] = useState<any[]>([]);
  const [health, setHealth] = useState(100);
  const [loading, setLoading] = useState(false);
  const [pinnedComponents, setPinnedComponents] = useState<any[]>([]);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const data = await getComponents(motor.id);
      setComponents(data || []);
      setHealth(calcHealth(data || []));
      setPinnedComponents((data || []).filter((c) => c.is_pinned));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchComponents);
    return unsubscribe;
  }, [navigation]);

  const togglePin = async (component: any) => {
    const isPinned = pinnedComponents.find((c) => c.id === component.id);

    try {
      if (isPinned) {
        // unpin
        setPinnedComponents(pinnedComponents.filter((c) => c.id !== component.id));
        const { error } = await supabase
          .from("motor_components")
          .update({ is_pinned: false })
          .eq("id", component.id);
        if (error) throw error;
      } else {
        if (pinnedComponents.length >= 2) {
          Alert.alert("Maksimal 2 komponen yang bisa dipin");
          return;
        }
        setPinnedComponents([...pinnedComponents, component]);
        const { error } = await supabase
          .from("motor_components")
          .update({ is_pinned: true })
          .eq("id", component.id);
        if (error) throw error;
      }

      // 🔑 refresh HomeScreen setelah pin/unpin
      onRefreshPinned?.();
    } catch (err) {
      console.log("Toggle pin error:", err);
      Alert.alert("Gagal update pin, coba lagi");
    }
  };

  const status = getStatus(health);

  return (
    <View style={{ flex: 1, backgroundColor: "#131313" }}>
      <ScrollView
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={26} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-xl ml-4">Motor Detail</Text>
        </View>

        {/* MOTOR CARD */}
        <View className="bg-[#212121] rounded-2xl p-5 mb-6">
          <Text className="text-white text-2xl font-semibold">{motor.name}</Text>
          <Text className="text-neutral-400 mt-2">Health: {health}%</Text>
          <Text style={{ color: status.color }} className="mt-1">
            {status.label} • {status.note}
          </Text>
        </View>

        {/* COMPONENTS */}
        <Text className="text-white text-lg mb-4">Components</Text>

        {loading && <Text className="text-neutral-400 mb-4">Loading...</Text>}
        {!loading && components.length === 0 && (
          <Text className="text-neutral-500 mb-4">No components found</Text>
        )}

        <View className="flex-row flex-wrap justify-between">
          {components.map((comp) => {
            const Icon =
              comp.name === "Oil"
                ? Droplet
                : comp.name === "Spark Plug"
                ? Zap
                : Wrench;
            const ratio = 1 - comp.current_value / comp.max_value;
            const color = ratio >= 0.8 ? "#22C55E" : ratio >= 0.5 ? "#FACC15" : "#EF4444";
            const isPinned = pinnedComponents.find((c) => c.id === comp.id);

            return (
              <View key={comp.id} className="w-[48%] mb-4 relative">
                <CircularWidget
                  current={comp.current_value}
                  max={comp.max_value}
                  label={comp.name}
                  color={color}
                  Icon={Icon}
                />
                {/* PIN BUTTON */}
                <TouchableOpacity
                  onPress={() => togglePin(comp)}
                  className="absolute top-2 right-2 bg-gray-800 rounded-full px-2 py-1"
                >
                  <Text className="text-white text-xs">{isPinned ? "Unpin" : "Pin"}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* ADD COMPONENT */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate("AddComponent", { motorId: motor.id })
          }
          className="mt-4 border border-neutral-600 border-dashed rounded-3xl py-5 items-center justify-center flex-row gap-2"
        >
          <Plus size={18} color="#9CA3AF" />
          <Text className="text-neutral-400 font-semibold">Add Component</Text>
        </TouchableOpacity>

        {/* SERVICE MOTOR */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate("ServiceMotor", {
              motorId: motor.id,
              motorName: motor.name,
            })
          }
          className="mt-4 mb-8 bg-[#34D399] rounded-3xl py-5 flex-row items-center justify-center gap-2"
        >
          <Wrench size={20} color="#052e2b" />
          <Text className="text-[#052e2b] font-bold text-base">Service Motor</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
