import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import {
  ArrowLeft,
  Droplet,
  Zap,
  Wrench,
  Plus,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { getComponents } from "@/api/motorComponent/getComponents";
import CircularWidget from "@/components/home/CircularStats";
import { supabase } from "@/api/supabaseClient";

/* ================= HELPERS ================= */
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

/* ================= SCREEN ================= */
export default function MotorDetailScreen({ route, navigation }: any) {
  const { motor, onRefreshPinned } = route.params;

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
      setHealth(calcHealth(data || []));
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener("focus", fetchComponents);
    return unsub;
  }, [navigation]);

  const togglePin = async (component: any) => {
    const isPinned = pinnedComponents.find((c) => c.id === component.id);

    try {
      if (!isPinned && pinnedComponents.length >= 2) {
        Alert.alert("Maksimal 2 komponen yang bisa dipin");
        return;
      }

      await supabase
        .from("motor_components")
        .update({ is_pinned: !isPinned })
        .eq("id", component.id);

      fetchComponents();
      onRefreshPinned?.();
    } catch (e) {
      Alert.alert("Gagal update pin");
    }
  };

  const status = getStatus(health);

  return (
    <View style={{ flex: 1, backgroundColor: "#131313" }}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= HEADER ================= */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={26} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-xl ml-4">Motor Detail</Text>
        </View>

        {/* ================= MOTOR CARD ================= */}
        <View className="bg-[#212121] rounded-3xl p-5 mb-8">
          <Text className="text-white text-2xl font-semibold">
            {motor.name}
          </Text>
          <Text className="text-neutral-400 mt-2">
            Health: {health}%
          </Text>
          <Text style={{ color: status.color }} className="mt-1">
            {status.label} • {status.note}
          </Text>
        </View>

        {/* ================= COMPONENTS ================= */}
        <Text className="text-white text-lg mb-4">Components</Text>

        {loading && (
          <Text className="text-neutral-400 mb-4">Loading...</Text>
        )}

        {!loading && components.length === 0 && (
          <Text className="text-neutral-500 mb-4">
            No components found
          </Text>
        )}

        {/* ================= GRID FIX ================= */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            rowGap: 16,
          }}
        >
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

            const isPinned = pinnedComponents.find(
              (c) => c.id === comp.id
            );

            return (
              <View
                key={comp.id}
                style={{
                  width: "48%",
                }}
              >
                {/* 🔥 CLICK KE EDIT */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation.navigate("EditComponent", {
                      component: comp,
                    })
                  }
                >
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
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "#1f2937",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 999,
                      }}
                    >
                      <Text className="text-white text-xs">
                        {isPinned ? "Unpin" : "Pin"}
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
            navigation.navigate("AddComponent", {
              motorId: motor.id,
            })
          }
          className="mt-6 border border-neutral-600 border-dashed rounded-3xl py-5 items-center justify-center flex-row gap-2"
        >
          <Plus size={18} color="#9CA3AF" />
          <Text className="text-neutral-400 font-semibold">
            Add Component
          </Text>
        </TouchableOpacity>

        {/* ================= SERVICE MOTOR ================= */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate("ServiceMotor", {
              motorId: motor.id,
              motorName: motor.name,
            })
          }
          className="mt-4 bg-[#34D399] rounded-3xl py-5 flex-row items-center justify-center gap-2"
        >
          <Wrench size={20} color="#052e2b" />
          <Text className="text-[#052e2b] font-bold text-base">
            Service Motor
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
