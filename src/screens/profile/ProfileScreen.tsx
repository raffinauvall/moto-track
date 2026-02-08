import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import { supabase } from "@/api/supabaseClient";
import { CommonActions } from "@react-navigation/native";

export default function ProfileScreen({ navigation }: any) {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) return Alert.alert("Error", error.message);
            setUser(data.user);
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) return Alert.alert("Logout Gagal", error.message);

        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Login" }], // screen auth
            })
        );
    };

    if (!user)
        return (
            <View className="flex-1 justify-center items-center bg-neutral-950">
                <Text className="text-white text-lg">Loading...</Text>
            </View>
        );

    return (
        <View className="flex-1 bg-[#131313]">
            {/* Header */}
            <View className="bg-[#212121] py-12 items-center rounded-b-3xl">
                <Image
                    source={{ uri: `https://i.pravatar.cc/150?u=${user.id}` }} // avatar random
                    className="w-24 h-24 rounded-full mb-4 border-4 border-white"
                />
                <Text className="text-white text-2xl font-maisonBold">
                    {user.user_metadata.name || "User"}
                </Text>
                <Text className="text-white text-base mt-1">{user.email}</Text>
            </View>

            {/* Quick Stats / Cards */}
            <View className="px-6 mt-6 space-y-4">
                <View className="bg-[#212121] rounded-2xl p-4 flex-row justify-between items-center shadow-lg">
                    <Text className="text-white font-maisonBold text-lg">Motor</Text>
                    <Text className="text-emerald-400 font-maisonBold">2</Text>
                </View>
                <View className="bg-[#212121] rounded-2xl p-4 flex-row justify-between items-center shadow-lg">
                    <Text className="text-white font-maisonBold text-lg">Services Done</Text>
                    <Text className="text-yellow-400 font-maisonBold">5</Text>
                </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
                className="mt-8 mx-6 bg-red-500 py-4 rounded-3xl shadow-lg items-center"
                onPress={handleLogout}
            >
                <Text className="text-white font-maisonBold text-lg">Logout</Text>
            </TouchableOpacity>
        </View>
    );
}
