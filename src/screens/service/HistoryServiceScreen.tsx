import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ChevronRight, Droplet, Wrench } from "lucide-react-native";
import { useState, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { GetService } from "@/api/service/getService";

export default function HistoryMotorScreen() {
  const navigation = useNavigation<any>();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await GetService();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
      setHistory([]);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

 return (
  <ScrollView className="flex-1 bg-[#131313] p-4 pt-12">
    <Text className="text-white text-3xl font-maisonBold mb-6">
      History Service
    </Text>

    {loading && <ActivityIndicator size="large" color="#34D399" />}

    {!loading && history.length === 0 && (
      <View className="flex-1 justify-center items-center mt-20">
        <Text className="text-gray-400 text-lg text-center font-maison">
          Belum ada history service 😔
        </Text>
        <Text className="text-gray-500 text-sm mt-2 text-center font-maison">
          Setelah melakukan service, history akan muncul di sini.
        </Text>
      </View>
    )}

    {!loading &&
      history.map((service) => {
        const isRingan = service.service_type === "Service Ringan";

        return (
          <TouchableOpacity
            key={service.id}
            onPress={() =>
              navigation.navigate("HistoryMotorDetail", {
                historyId: service.id,
                serviceType: service.service_type,
                serviceDate: service.service_date,
              })
            }
            className="bg-[#212121] rounded-xl p-4 flex-row justify-between items-center mb-3"
          >
            <View className="flex-row items-center">
              {isRingan ? (
                <Droplet size={30} color="#34D399" />
              ) : (
                <Wrench size={30} color="#FBBF24" />
              )}
              <View className="ml-3">
                <Text className="text-white text-lg font-semibold">
                  {service.service_type}
                </Text>
                <Text className="text-gray-400 text-sm">
                  {new Date(service.service_date).toDateString()}
                </Text>
              </View>
            </View>
            <ChevronRight size={24} color="#fff" />
          </TouchableOpacity>
        );
      })}
  </ScrollView>
);

}
