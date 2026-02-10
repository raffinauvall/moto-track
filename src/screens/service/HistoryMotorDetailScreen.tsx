import { View, Text, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";

export default function HistoryMotorDetailScreen({ route }: any) {
  const { historyId, serviceType, serviceDate } = route.params;
  const [details, setDetails] = useState<any[]>([]);

  useEffect(() => {
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    const { data } = await supabase
      .from("motor_services")
      .select("*")
      .eq("service_history_id", historyId);

    setDetails(data || []);
  };

  return (
    <ScrollView className="flex-1 bg-[#131313] p-6 pt-12">
      <Text className="text-white text-2xl font-bold">
        {serviceType}
      </Text>
      <Text className="text-gray-400 mb-6">
        {new Date(serviceDate).toDateString()}
      </Text>

      {details.map((item) => (
        <View
          key={item.id}
          className="bg-[#212121] rounded-xl p-4 mb-3"
        >
          <Text className="text-white font-semibold">
            {item.component_name}
          </Text>
          <Text className="text-gray-400 text-sm">
            KM saat service: {item.km_at_service}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
