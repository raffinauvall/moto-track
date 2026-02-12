import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Header from "@/components/home/Header";
import MotorCard from "@/components/home/MotorCards";
import PinnedComponents from "@/components/home/PinnedComponents";
import { useActiveMotor } from "@/context/ActiveMotorContext";
import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { useRideTracker } from "@/hooks/motor/useRideTracker";

type HomeScreenProps = { setIndex: (i: number) => void };

export default function HomeScreen({ setIndex }: HomeScreenProps) {
  const { activeMotor, refreshActiveMotor } = useActiveMotor();
  const { isRiding, kmCounter, componentsState, startRide, stopRide } = useRideTracker(activeMotor);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setUserName(data.user.user_metadata?.name || "User");
      refreshActiveMotor();
    })();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, backgroundColor: "#131313" }} showsVerticalScrollIndicator={false}>
      <Header name={userName} />

      {/* Motor card */}
      <MotorCard
        motor={activeMotor?.name || "No Active Motor"}
        health={activeMotor?.health ?? 100}
        onChangeMotor={() => setIndex(1)}
      />

      {/* Pinned components */}
      <PinnedComponents activeMotor={activeMotor} componentsState={componentsState}  />


      {/* Start / Stop Ride button */}
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={!activeMotor}
        onPress={isRiding ? stopRide : startRide}
        style={{
          marginTop: 24,
          backgroundColor: activeMotor ? "#34D399" : "#374151",
          paddingVertical: 16,
          borderRadius: 16,
          alignItems: "center"
        }}
      >
        <Text style={{
          color: activeMotor ? "#052e2b" : "#9CA3AF",
          fontWeight: "bold",
          fontSize: 16
        }}>
          {isRiding ? `Riding... ${kmCounter.toFixed(2)} km` : "Start Tracking"}
        </Text>
      </TouchableOpacity>

      {!activeMotor && <Text style={{ color: "#9CA3AF", textAlign: "center", marginTop: 12 }}>Pilih motor terlebih dahulu</Text>}
    </ScrollView>
  );
}
