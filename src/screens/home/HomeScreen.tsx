import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Bell, Motorbike, Droplet, Zap } from "lucide-react-native";
import CircularWidget from "@/components/home/CircularStats";
import MotorCard from "@/components/home/MotorCards";
import { useEffect, useState } from "react";
import Header from "@/components/home/Header";
import { supabase } from "@/api/supabaseClient";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
    const navigation = useNavigation<any>();

    const [userName, setUserName] = useState("User");
    const [activeMotor, setActiveMotor] = useState<any>(null);

    const [stats, setStats] = useState({
        oil: { current: 500, max: 2000 },
        spark: { current: 236, max: 10000 }
    });

    // ambil user
    const fetchUser = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            console.log(error.message);
            return;
        }
        setUserName(data.user?.user_metadata.name || "User");
    };

    // ambil motor aktif
    const fetchActiveMotor = async () => {
        try {
            const { data } = await supabase
                .from("motors")
                .select("*")
                .eq("is_active", true)
                .single();

            if (data) {
                setActiveMotor(data);
            }
        } catch (error) {
            console.log("Belum ada motor aktif");
        }
    };

    useEffect(() => {
        fetchUser();
        fetchActiveMotor();
    }, []);

    // refresh otomatis saat balik ke Home
    useEffect(() => {
        const unsub = navigation.addListener("focus", fetchActiveMotor);
        return unsub;
    }, [navigation]);

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1, padding: 24, backgroundColor: "#131313" }}
            showsVerticalScrollIndicator={false}
        >
            <Header name={userName} />

            {/* Stats Cards */}
            <View className="space-y-4 mb-5">

                <MotorCard 
                    motor={activeMotor?.name || "No Active Motor"} 
                />

                <View className="flex-row gap-4 ">
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

            {/* Start Tracking Button */}
            <TouchableOpacity className="bg-[#34D399] py-5 rounded-3xl shadow-2xl mb-5">
                <Text className="text-center font-maisonBold text-black text-lg">
                    Start Tracking
                </Text>
            </TouchableOpacity>

            {/* Footer / Note */}
            <Text className="text-neutral-500 font-maison text-center">
                Klik Start untuk mulai tracking motor anda
            </Text>
        </ScrollView>
    );
}
