import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ArrowLeft, Droplet, Zap, Wrench, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { getComponents } from "@/api/motorComponent/getComponents";
import CircularWidget from "@/components/home/CircularStats";

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

  return Math.round(
    (ratios.reduce((a, b) => a + b, 0) / ratios.length) * 100
  );
};

// ================= screen =================

export default function MotorDetailScreen({ route, navigation }: any) {
  const { motor } = route.params;

  const [components, setComponents] = useState<any[]>([]);
  const [health, setHealth] = useState(100);
  const [loading, setLoading] = useState(false);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const data = await getComponents(motor.id);
      setComponents(data || []);
      setHealth(calcHealth(data || []));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  const status = getStatus(health);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 24,
        backgroundColor: "#131313",
      }}
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
        <Text className="text-white text-2xl">{motor.name}</Text>

        <Text className="text-neutral-400 mt-2">
          Health: {health}%
        </Text>

        <Text style={{ color: status.color }}>
          {status.label} • {status.note}
        </Text>
      </View>

      {/* COMPONENTS TITLE */}
      <Text className="text-white text-lg mb-4">Components</Text>

      {loading && <Text className="text-neutral-400">Loading...</Text>}

      {!loading && components.length === 0 && (
        <Text className="text-neutral-500 mb-4">No components found</Text>
      )}

      {/* 🔥 GRID 2 KOLOM */}
      <View className="flex-row flex-wrap justify-between">
        {components.map((comp) => {
          const Icon =
            comp.name === "Oil"
              ? Droplet
              : comp.name === "Spark Plug"
              ? Zap
              : Wrench;

          const ratio = 1 - comp.current_value / comp.max_value;

          const color =
            ratio >= 0.8
              ? "#22C55E"
              : ratio >= 0.5
              ? "#FACC15"
              : "#EF4444";

          return (
            <View key={comp.id} className="w-[48%] mb-4">
              <CircularWidget
                current={comp.current_value}
                max={comp.max_value}
                label={comp.name}
                color={color}
                Icon={Icon}
              />
            </View>
          );
        })}
      </View>

      {/* ================= ADD COMPONENT BUTTON (UI ONLY) ================= */}
      <TouchableOpacity
        activeOpacity={0.8}
        className="mt-2 border border-neutral-600 border-dashed rounded-3xl py-5 items-center justify-center flex-row gap-2"
      >
        <Plus size={18} color="#9CA3AF" />
        <Text className="text-neutral-400 font-semibold">
          Add Component
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
