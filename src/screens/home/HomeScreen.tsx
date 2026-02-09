import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Droplet, Zap, Wrench } from "lucide-react-native";
import CircularWidget from "@/components/home/CircularStats";
import MotorCard from "@/components/home/MotorCards";
import Header from "@/components/home/Header";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/api/supabaseClient";
import { useActiveMotor } from "@/context/ActiveMotorContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

type HomeScreenProps = {
  setIndex: (i: number) => void;
};


export default function HomeScreen({ setIndex }: HomeScreenProps) {
    const { activeMotor, refreshActiveMotor } = useActiveMotor();
    const [userName, setUserName] = useState("User");
    const [pinnedComponents, setPinnedComponents] = useState<any[]>([]);
    const navigation: any = useNavigation();

    // fetch user
    const fetchUser = async () => {
        const { data } = await supabase.auth.getUser();
        if (data.user) setUserName(data.user.user_metadata?.name || "User");
    };

    // fetch pinned components
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
        if (!error && data) setPinnedComponents(data);
    }, [activeMotor]);

    // focus effect → refresh pinned components tiap kali HomeScreen fokus
    useFocusEffect(
        useCallback(() => {
            fetchPinnedComponents();
        }, [fetchPinnedComponents])
    );

    useEffect(() => {
        fetchUser();
        refreshActiveMotor();
    }, []);

    const getCardWidth = (count: number) => {
        if (count === 1) return 200;
        if (count === 2) return "48%";
        if (count === 3 || count === 4) return "47%";
        return "48%";
    };

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

            <View style={{ marginBottom: 20 }}>
                <MotorCard
                    motor={activeMotor?.name || "No Active Motor"}
                    health={activeMotor?.health ?? 100}
                    onChangeMotor={() => setIndex(1)}
                />



                {/* Pinned Components */}
                {pinnedComponents.length > 0 ? (
                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent:
                                pinnedComponents.length === 1 ? "center" : "flex-start",
                            gap: 8,
                            marginTop: 16,
                        }}
                    >
                        {pinnedComponents.map((comp) => {
                            const Icon =
                                comp.name === "Oli"
                                    ? Droplet
                                    : comp.name === "Busi"
                                        ? Zap
                                        : Wrench;
                            const color = comp.name === "Oli" ? "#34D399" : "#FACC15";

                            return (
                                <View
                                    key={comp.id}
                                    style={{
                                        width: getCardWidth(pinnedComponents.length),
                                        marginBottom: 16,
                                        alignItems: "center",
                                    }}
                                >
                                    <CircularWidget
                                        current={comp.current_value}
                                        max={comp.max_value}
                                        label={comp.name}
                                        color={color}
                                        Icon={Icon}
                                    />
                                </View>
                            );
                        })}
                    </View>
                ) : (
                    <Text
                        style={{
                            color: "#9CA3AF",
                            textAlign: "center",
                            marginTop: 20,
                        }}
                    >
                        Pilih 2 komponen untuk dipin di Motor Detail
                    </Text>
                )}

                {/* START TRACKING */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    disabled={!activeMotor}
                    onPress={() => {
                        if (activeMotor) {
                            navigation.navigate("TrackingScreen", { motor: activeMotor });
                        }
                    }}
                    style={{
                        marginTop: 24,
                        backgroundColor: activeMotor ? "#34D399" : "#374151",
                        paddingVertical: 16,
                        borderRadius: 16,
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            color: activeMotor ? "#052e2b" : "#9CA3AF",
                            fontWeight: "bold",
                            fontSize: 16,
                        }}
                    >
                        Start Tracking
                    </Text>
                </TouchableOpacity>

                {/* Pesan pilih motor jika belum ada */}
                {!activeMotor && (
                    <Text
                        style={{
                            color: "#9CA3AF",
                            textAlign: "center",
                            marginTop: 12,
                        }}
                    >
                        Pilih motor terlebih dahulu
                    </Text>
                )}
            </View>
        </ScrollView>
    );
}
