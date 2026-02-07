import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Bell, Motorbike, Droplet, Zap } from "lucide-react-native";
import CircularWidget from "@/components/home/CircularStats";
import MotorCard from "@/components/home/MotorCards";
import { useState } from "react";
export default function HomeScreen() {
    const [motor, setMotor] = useState("Yamaha Scorpio")
    const [stats, setStats] = useState({
        oil: { current: 500, max: 2000 },
        spark: { current: 236, max: 10000 }
    });

    const changeMotor = () => {
        setMotor(motor === "Yamaha Scorpio" ? "Honda Tiger" : "Yamaha Scorpio")
    }
    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1, padding: 24, backgroundColor: "#131313" }}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View className="flex-row items-center justify-between mb-8 pt-3">
                <View className="">
                    <Text className="text-gray-500 mb-1">Welcome Back</Text>
                    <Text className="text-white text-2xl font-maisonBold" adjustsFontSizeToFit>Raffi Nauval</Text>
                </View>
                <View>
                    <TouchableOpacity className="p-3 border border-gray-500 rounded-[10px]">
                        <Bell size={20} color="#ffffff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Stats Cards */}
            <View className="space-y-4 mb-12">
                <MotorCard motor={motor} onChangeMotor={changeMotor} />

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
            <TouchableOpacity className="bg-[#34D399] py-5 rounded-3xl shadow-2xl mb-12">
                <Text className="text-center font-maisonBold text-black text-lg">
                    Start Tracking
                </Text>
            </TouchableOpacity>

            {/* Footer / Note */}
            <Text className="text-neutral-500 font-maison text-center">
                Pastikan motor dalam kondisi menyala untuk tracking jarak tempuh.
            </Text>
        </ScrollView>
    );
}
