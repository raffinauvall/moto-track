import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { ChevronRight, Droplet, Wrench } from "lucide-react-native";

export default function ServiceScreen() {
  const serviceHistory = [
    { type: "Service Ringan", date: "10 Feb 2026", icon: <Droplet size={30} color="#34D399" /> },
    { type: "Service Berat", date: "15 Jan 2026", icon: <Wrench size={30} color="#FBBF24" /> },
    { type: "Service Ringan", date: "20 Des 2025", icon: <Droplet size={30} color="#34D399" /> },
  ];

  return (
    <ScrollView className="flex-1 bg-[#131313] p-4 pt-12">
      <Text className="text-white text-3xl font-bold mb-6">Service Motor</Text>

      <TouchableOpacity className="bg-green-500 p-4 rounded-xl mb-6 items-center shadow-md">
        <Text className="text-white font-bold text-lg">Add Service History</Text>
      </TouchableOpacity>

      <View className="space-y-4">
        {serviceHistory.map((service, index) => (
          <TouchableOpacity
            key={index}
            className="bg-[#212121] rounded-xl p-4 flex-row justify-between items-center shadow-sm mb-3"
            onPress={() => console.log(`Go to detail of ${service.type}`)}
          >
            <View className="flex-row items-center space-x-3 ">
              {service.icon}
              <View className="ms-3">
                <Text className="text-white text-lg font-semibold">{service.type}</Text>
                <Text className="text-gray-400 text-sm">{service.date}</Text>
              </View>
            </View>
            <ChevronRight size={24} color="#ffffff" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
