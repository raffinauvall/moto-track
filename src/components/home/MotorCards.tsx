import { View, Text, Pressable } from "react-native";
import { ArrowRightLeft } from "lucide-react-native";

export default function MotorCard({ motor, onChangeMotor }: { motor: string; onChangeMotor: () => void }) {
    return (
        <View className="flex-row items-center justify-between bg-[#212121] mb-4 rounded-3xl p-6 shadow-md">
            <View>
                <Text className="text-neutral-400 font-maison text-sm">Motor Aktif</Text>
                <Text
                    className="text-white font-maisonBold text-2xl mt-1"
                    adjustsFontSizeToFit
                    numberOfLines={2}
                >
                    Yamaha Scorpio
                </Text>
            </View>

            {/* Tombol Ganti Motor */}
            <Pressable
                onPress={onChangeMotor}
                className="flex-row items-center px-3 py-2 rounded-full bg-[#34D399]/20"
                android_ripple={{ color: "#34D399" }}
            >
                <ArrowRightLeft size={30} color="#34D399" />
            </Pressable>
        </View>
    );
}
