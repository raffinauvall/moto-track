import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { supabase } from "@/api/supabaseClient";
import { CommonActions } from "@react-navigation/native";
import { LogOut, Bike, Wrench } from "lucide-react-native";
import { GetMotor } from "@/api/motor/getMotor";
import { GetService } from "@/api/service/getService";

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [motorCount, setMotorCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);


        const motors = await GetMotor();
        setMotorCount(motors.length);
      } catch (err: any) {
        Alert.alert("Error", err.message);
      }
    };

    init();
  }, []);
    useEffect(() => {
    const init = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);


        const service = await GetService();
        setServiceCount(service.length);
      } catch (err: any) {
        Alert.alert("Error", err.message);
      }
    };

    init();
  }, []);


  const handleLogout = async () => {
    await supabase.auth.signOut();

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-[#131313]">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#131313]">
      <View className="bg-[#1c1c1c] pt-16 pb-10 items-center rounded-b-[40px]">
        <Image
          source={{ uri: `https://i.pravatar.cc/200?u=${user.id}` }}
          className="w-28 h-28 rounded-full mb-4 border-4 border-neutral-700"
        />

        <Text className="text-white text-2xl font-maisonBold">
          {user.user_metadata?.name || "Rider"}
        </Text>

        <Text className="text-neutral-400 text-sm mt-1 font-maison">
          {user.email}
        </Text>
      </View>

      {/* stats */}
      <View className="px-6 mt-8 flex-row justify-between">
        <View className="w-[48%] bg-[#212121] p-5 rounded-2xl">
          <View className="flex-row items-center justify-between">
            <Bike color="#22C55E" size={22} />
            <Text className="text-emerald-400 text-xl font-maisonBold">
              {motorCount}
            </Text>
          </View>
          <Text className="text-neutral-400 mt-3 font-maison">Motors</Text>
        </View>

        <View className="w-[48%] bg-[#212121] p-5 rounded-2xl">
          <View className="flex-row items-center justify-between">
            <Wrench color="#FACC15" size={22} />
            <Text className="text-yellow-400 text-xl font-maisonBold">{serviceCount}</Text>
          </View>
          <Text className="text-neutral-400 mt-3 font-maison">Services</Text>
        </View>
      </View>


      <TouchableOpacity
        onPress={handleLogout}
        className="m-6 bg-[#2a2a2a] py-4 rounded-2xl flex-row justify-center items-center"
      >
        <LogOut size={18} color="#EF4444" />
        <Text className="text-red-500 ml-2 font-maisonBold">Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
