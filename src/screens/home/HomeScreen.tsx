import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Droplet, Zap } from "lucide-react-native";
import CircularWidget from "@/components/home/CircularStats";
import MotorCard from "@/components/home/MotorCards";
import { useEffect, useState } from "react";
import Header from "@/components/home/Header";
import { supabase } from "@/api/supabaseClient";
import { useActiveMotor } from "@/context/ActiveMotorContext";

export default function HomeScreen() {
  const { activeMotor, refreshActiveMotor } = useActiveMotor(); 
  const [userName, setUserName] = useState("User");

  const [stats, setStats] = useState({
    oil: { current: 500, max: 2000 },
    spark: { current: 236, max: 10000 },
  });

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      setUserName(data.user.user_metadata?.name || "User");
    }
  };


  useEffect(() => {
    fetchUser();
    refreshActiveMotor(); 
  }, []);

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

      {/* Motor Card */}
      <View className="space-y-4 mb-5">
        <MotorCard motor={activeMotor?.name || "No Active Motor"} />

        <View className="flex-row gap-4">
          <CircularWidget
            current={stats.oil.current}
            max={stats.oil.max}
            label="Oil Change"
            color="#34D399"
            Icon={Droplet}
          />
          <CircularWidget
            current={stats.spark.current}
            max={stats.spark.max}
            label="Spark Plug"
            color="#FACC15"
            Icon={Zap}
          />
        </View>
      </View>

      {/* Start Tracking */}
      <TouchableOpacity
        disabled={!activeMotor}
        className={`py-5 rounded-3xl mb-5 ${
          activeMotor ? "bg-[#34D399]" : "bg-neutral-600"
        }`}
      >
        <Text className="text-center font-maisonBold text-black text-lg">
          Start Tracking
        </Text>
      </TouchableOpacity>

      <Text className="text-neutral-500 font-maison text-center">
        {activeMotor
          ? "Klik Start untuk mulai tracking motor anda"
          : "Pilih motor aktif terlebih dahulu"}
      </Text>
    </ScrollView>
  );
}
