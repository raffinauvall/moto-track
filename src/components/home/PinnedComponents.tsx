import { View } from "react-native";
import CircularWidget from "./CircularStats";
import { Droplet, Zap, Wrench } from "lucide-react-native";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/api/supabaseClient";

const COMPONENT_ICONS: Record<string, any> = {
  Oil: Droplet,
  Oli: Droplet,
  "Spark Plug": Zap,
  Busi: Zap,
};

export default function PinnedComponents({
  activeMotor,
  componentsState,
}: {
  activeMotor: any;
  componentsState: any[];
}) {
  const [pinnedComponents, setPinnedComponents] = useState<any[]>([]);

  const fetchPinnedComponents = useCallback(async () => {
    if (!activeMotor) {
      setPinnedComponents([]);
      return;
    }

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

  if (!activeMotor || pinnedComponents.length === 0) return null;

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 15,
      }}
    >
      {pinnedComponents.map((comp) => {
        const liveComp = componentsState.find(
          (c) => c.id === comp.id
        );

        const current =
          liveComp?.current_value ?? comp.current_value;

        const max =
          liveComp?.max_value ?? comp.max_value;

        /* 🔥 SAMA PERSIS KAYAK DETAIL */
        const ratio = 1 - current / max;

        const color =
          ratio >= 0.8
            ? "#22C55E"
            : ratio >= 0.5
            ? "#FACC15"
            : "#EF4444";

        const Icon =
          COMPONENT_ICONS[comp.name] || Wrench;

        return (
          <View
            key={comp.id}
            style={{
              width: "48%",
              
            }}
          >
            <CircularWidget
              current={current}
              max={max}
              label={comp.name}
              color={color}
              Icon={Icon}
            />
          </View>
        );
      })}
    </View>
  );
}
