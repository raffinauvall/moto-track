import { View, Text, ScrollView } from "react-native";
import Header from "@/components/home/Header";
import MotorHealthBar from "@/components/motor/MotorHealthBar";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react-native";
import MotorHeader from "@/components/motor/MotorHeader";

// Helper function untuk status motor
const getStatus = (value: number) => {
    if (value >= 80)
        return {
            label: "GOOD",
            color: "#22C55E",
            note: "Ready for daily use",
        };
    if (value >= 50)
        return {
            label: "WARNING",
            color: "#FACC15",
            note: "Maintenance recommended soon",
        };
    return {
        label: "SERVICE",
        color: "#EF4444",
        note: "Immediate service is recommended",
    };
};

// Component icon status
const StatusIcon = ({ value }: { value: number }) => {
    if (value >= 80) return <CheckCircle size={20} color="#22C55E" />;
    if (value >= 50) return <AlertTriangle size={20} color="#FACC15" />;
    return <XCircle size={20} color="#EF4444" />;
};

export default function MotorScreen() {
    const motors = [
        { name: "Yamaha Scorpio", health: 82 },
        { name: "Yamaha Aerox", health: 72 },
        { name: "Yamaha Mio Z", health: 12 }
    ];

    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                padding: 24,
                backgroundColor: "#131313",
            }}
            showsVerticalScrollIndicator={false}
        >
            <MotorHeader
                motorName="Yamaha Scorpio"
                onBellPress={() => console.log("Bell pressed")}
            />

            <View className="flex-col gap-3">
                {motors.map((motor, index) => {
                    const status = getStatus(motor.health);

                    return (
                        <View
                            key={index}
                            className="w-full bg-[#212121] p-4 rounded-xl"
                        >
                            {/* HEADER ROW: Nama motor + status icon */}
                            <View className="flex-row items-center justify-between mb-3">
                                <Text className="text-white font-maisonBold text-xl">
                                    {motor.name}
                                </Text>

                                {/* Icon + optional text */}
                                <View className="flex-row items-center gap-1">
                                    <StatusIcon value={motor.health} />
                                    <Text
                                        className="text-xs font-maisonBold"
                                        style={{ color: status.color }}
                                    >
                                        {status.label}
                                    </Text>
                                </View>
                            </View>

                            {/* Health bar */}
                            <MotorHealthBar value={motor.health} />

                            {/* Note text */}
                            <Text className="text-xs text-gray-400 mt-2">
                                {status.note}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
}
