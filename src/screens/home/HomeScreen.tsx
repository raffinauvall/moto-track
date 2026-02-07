import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Bell, Motorbike, Droplet, Zap } from "lucide-react-native";
import StatsCard from "@/components/CircularStats";
import CircularWidget from "@/components/CircularStats";

export default function HomeScreen() {
    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1, padding: 24, backgroundColor: "#131313" }}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View className="flex-row items-center justify-between mb-8 pt-3">
                <View className="">
                    <Text className="text-gray-500 mb-2">Welcome Back</Text>
                    <Text className="text-white text-2xl font-maisonBold">Raffi Nauval</Text>
                </View>
                <View>
                    <TouchableOpacity className="p-3 border border-gray-500 rounded-[10px]">
                        <Bell size={20} color="#ffffff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Stats Cards */}
            <View className="space-y-4 mb-12">
                <View className="flex-row items-center justify-between bg-[#212121] mb-4 rounded-3xl p-6 shadow-md">
                    <View>
                        <Text className="text-neutral-400 font-maison text-sm">Motor Aktif</Text>
                        <Text className="text-white font-maisonBold text-2xl mt-1">Yamaha Scorpio 225</Text>
                    </View>
                    <Motorbike size={36} color="#34D399" />
                </View>

                <View className="flex-row gap-4 ">
                    <CircularWidget
                        current={500}
                        max={2000}
                        label="Oil Change"
                        color="#34D399"
                        Icon={Droplet}
                    />
                    <CircularWidget
                        current={1500}
                        max={3000}
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
