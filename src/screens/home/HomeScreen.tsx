import {
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import Header from "@/components/home/Header";
import MotorCard from "@/components/home/MotorCards";
import PinnedComponents from "@/components/home/PinnedComponents";
import { useActiveMotor } from "@/context/ActiveMotorContext";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/api/supabaseClient";
import { useFocusEffect } from "@react-navigation/native";
import { useRideTracker } from "@/hooks/motor/useRideTracker";

type HomeScreenProps = { setIndex: (i: number) => void };

export default function HomeScreen({ setIndex }: HomeScreenProps) {
  const { activeMotor, refreshActiveMotor } = useActiveMotor();

  const {
    isRiding,
    kmCounter,
    componentsState,
    startRide,
    stopRide,
    reloadComponents, 
  } = useRideTracker(activeMotor);

  const [userName, setUserName] = useState("User");

  /* ================= USER ================= */
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user)
        setUserName(data.user.user_metadata?.name || "User");
    })();
  }, []);

  /* ================= RELOAD SAAT BALIK KE HOME ================= */
  useFocusEffect(
    useCallback(() => {
      refreshActiveMotor();
      reloadComponents?.(); 
    }, [activeMotor])
  );

  /* ================= HEALTH ================= */
  const calculateHealth = (components: any[]) => {
    if (!components?.length) return 100;

    const ratios = components.map((c) =>
      Math.max(0, 1 - c.current_value / c.max_value)
    );

    return Math.round(
      (ratios.reduce((a, b) => a + b, 0) / ratios.length) * 100
    );
  };

  const health = calculateHealth(componentsState);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 24,
        backgroundColor: "#131313",
      }}
      showsVerticalScrollIndicator={false}
    >
      <Header name={userName} />

      <MotorCard
        motor={activeMotor?.name || "No Active Motor"}
        health={health}
        onChangeMotor={() => setIndex(1)}
      />

      <PinnedComponents
        activeMotor={activeMotor}
        componentsState={componentsState}
      />

      <TouchableOpacity
        activeOpacity={0.8}
        disabled={!activeMotor}
        onPress={isRiding ? stopRide : startRide}
        style={{
          marginTop: 14,
          backgroundColor: activeMotor ? "#34D399" : "#374151",
          paddingVertical: 16,
          borderRadius: 16,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: activeMotor ? "#052e2b" : "#9CA3AF",
            fontFamily: "MaisonNeue-Bold",
            fontSize: 16,
          }}
        >
          {isRiding
            ? `Riding... ${kmCounter.toFixed(2)} km`
            : "Start Tracking"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
