import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useServiceDetails } from "@/hooks/service/useDetailServiceHistory";
import { ChevronLeft } from "lucide-react-native";

export default function HistoryMotorDetailScreen({ route }: any) {
  const navigation = useNavigation<any>();
  const { historyId, serviceType, serviceDate } = route.params;

  const { details, loading, fetchDetails } = useServiceDetails(historyId);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return (
    <ScrollView className="flex-1 bg-[#131313] p-6 pt-12">
      {/* Back Button */}
      <TouchableOpacity
        className="mb-4 flex-row items-center"
        onPress={() => navigation.goBack()}
      >
        <ChevronLeft size={28} color="#fff" />
        <Text className="text-white text-lg ml-2">Kembali</Text>
      </TouchableOpacity>

      <Text className="text-white text-2xl font-maisonBold">{serviceType}</Text>
      <Text className="text-gray-400 font-maison mb-6">
        {new Date(serviceDate).toDateString()}
      </Text>

      {loading && (
        <Text className="text-gray-400 font-maison text-center">Loading...</Text>
      )}

      {!loading &&
        details.map((item) => (
          <View
            key={item.id}
            className="bg-[#212121] rounded-xl p-4 mb-3"
          >
            <Text className="text-white font-maisonBold">
              {item.component_name}
            </Text>
            <Text className="text-gray-400 text-sm font-maison">
              KM saat service: {item.km_at_service}
            </Text>
          </View>
        ))}
    </ScrollView>
  );
}
