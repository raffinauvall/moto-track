import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { Droplet, Wrench, Zap } from "lucide-react-native";

export default function ServiceScreen() {
  const serviceParts = [
    { name: "Oli Mesin", info: "500 km / 2000 km", icon: <Droplet size={20} color="#34D399" /> },
    { name: "Busi", info: "1000 km / 5000 km", icon: <Zap size={20} color="#FBBF24" /> },
    { name: "Filter Udara", info: "1500 km / 3000 km", icon: <Wrench size={20} color="#F87171" /> },
    { name: "Rantai & Gir", info: "2000 km / 6000 km", icon: <Wrench size={20} color="#60A5FA" /> },
    { name: "Rem Depan", info: "1200 km / 4000 km", icon: <Wrench size={20} color="#F97316" /> },
  ];

  return (
    <ScrollView className="flex-1 bg-[#131313] p-4 pt-12">
      {/* Judul Halaman */}
      <Text className="text-white text-3xl font-bold mb-6">Service Motor</Text>

      {/* Tombol Add Service History */}
      <TouchableOpacity className="bg-green-500 p-4 rounded-xl mb-6 items-center shadow-lg">
        <Text className="text-white font-bold text-lg">Add Service History</Text>
      </TouchableOpacity>

      {/* Card Service Ringan */}
      <View className="bg-[#212121] w-full p-4 rounded-xl shadow-md mb-6 pb-1">
        {/* Header Card */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-white">Service Ringan</Text>
          <Text className="text-gray-400 text-sm">10 Feb 2026</Text>
        </View>

        {/* List Part */}
        <View className="space-y-3 bg-gray-800 rounded-xl mb-5">
          {serviceParts.map((part, index) => (
            <View
              key={index}
              className="flex-row justify-between items-center  p-3 rounded-lg"
            >
              <View className="flex-row items-center space-x-3 ">
                {part.icon}
                <Text className="text-white font-medium ms-2">{part.name}</Text>
              </View>
              <Text className="text-gray-400 text-sm">{part.info}</Text>
            </View>
          ))}
        </View>
        <View className="flex-row justify-between">
                    <TouchableOpacity className="bg-green-500 w-[48%] p-4 rounded-xl mb-6 items-center shadow-lg">
        <Text className="text-white font-bold text-lg">Edit </Text>
      </TouchableOpacity>
      <TouchableOpacity className="bg-red-500 p-4 rounded-xl w-[48%] mb-6 items-center shadow-lg">
        <Text className="text-white font-bold text-lg">Delete</Text>
      </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}
