import { View, useWindowDimensions } from "react-native";
import CircularWidget from "./CircularStats";
import { Droplet, Zap, Wrench } from "lucide-react-native";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/api/supabaseClient";

const COMPONENT_ICONS: Record<string, any> = {
  Oli: Droplet,
  Busi: Zap,
  // tambah mapping di sini
};

const COMPONENT_COLORS: Record<string, string> = {
  Oli: "#34D399",
  Busi: "#FACC15",
  // tambah warna di sini
};

export default function PinnedComponents({
  activeMotor,
  componentsState,
}: {
  activeMotor: any;
  componentsState: any[];
}) {
  const [pinnedComponents, setPinnedComponents] = useState<any[]>([]);
  const { width } = useWindowDimensions();

  const fetchPinnedComponents = useCallback(async () => {
    if (!activeMotor) return setPinnedComponents([]);

    const { data, error } = await supabase
      .from("motor_components")
      .select("*")
      .eq("motor_id", activeMotor.id)
      .eq("is_pinned", true)
      .limit(4);

    if (error) {
      console.error("Error fetching pinned components:", error);
      return;
    }

    if (data) setPinnedComponents(data);
  }, [activeMotor]);

  useEffect(() => {
    fetchPinnedComponents();
  }, [fetchPinnedComponents]);

  const getItemWidth = () => {
    const count = pinnedComponents.length;
    const containerPadding = 32; // sesuaikan dengan padding parent kamu
    const gap = 12;

    if (count === 1) return width - containerPadding;
    return (width - containerPadding - gap) / 2;
  };

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        columnGap: 12,
        rowGap: 12,
        marginTop: 16,
      }}
    >
      {pinnedComponents.map((comp) => {
        const liveComp = componentsState.find((c) => c.id === comp.id);
        const current = liveComp?.current_value ?? comp.current_value;
        const max = liveComp?.max_value ?? comp.max_value;
        const Icon = COMPONENT_ICONS[comp.name] || Wrench;
        const color = COMPONENT_COLORS[comp.name] || "#94A3B8";
        const itemWidth = getItemWidth();

        return (
          <View key={comp.id} style={{ width: itemWidth }}>
            <CircularWidget
              current={current}
              max={max}
              label={comp.name}
              color={color}
              Icon={Icon}
              size={itemWidth}
            />
          </View>
        );
      })}
    </View>
  );
}