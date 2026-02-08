import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { ArrowLeft, Droplet, Zap, Wrench, Plus } from "lucide-react-native";
import CircularWidget from "@/components/home/CircularStats";
import { useEffect, useState } from "react";
import { getComponents } from "@/api/motorComponent/getComponents";
import { addComponent } from "@/api/motorComponent/addComponents";

// helper status
const getStatus = (value: number) => {
  if (value >= 80)
    return { label: "GOOD", color: "#22C55E", note: "Ready for daily use" };
  if (value >= 50)
    return { label: "WARNING", color: "#FACC15", note: "Maintenance recommended soon" };
  return { label: "SERVICE", color: "#EF4444", note: "Immediate service is recommended" };
};

// icon status
const StatusIcon = ({ value }: { value: number }) => {
  if (value >= 80) return <Droplet size={20} color="#22C55E" />;
  if (value >= 50) return <Zap size={20} color="#FACC15" />;
  return <Wrench size={20} color="#EF4444" />;
};

export default function MotorDetailScreen({ route, navigation }: any) {
  const { motor } = route.params;
  const status = getStatus(motor.health);

  const [components, setComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // fetch komponen tiap motor
  const fetchComponents = async () => {
    setLoading(true);
    try {
      const data = await getComponents(motor.id);
      setComponents(data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  // tambah komponen baru
  const handleAddComponent = async () => {
    // bisa pake Alert.prompt atau modal input nama
    const name = prompt("Nama Component Baru:");
    if (!name) return;

    try {
      const data = await addComponent(motor.id, name);
      setComponents((prev) => [...prev, ...data]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, padding: 24, backgroundColor: "#131313" }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={26} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-maisonBold ml-4">Motor Detail</Text>
      </View>

      {/* Motor Card */}
      <View className="bg-[#212121] rounded-2xl p-5 mb-6">
        <Text className="text-white text-2xl font-maisonBold">{motor.name}</Text>
        <View className="flex-row items-center mt-2">
          <Text className="font-maisonBold text-sm" style={{ color: status.color }}>
            {status.label}
          </Text>
          <Text className="text-neutral-400 text-sm ml-2">• {status.note}</Text>
        </View>
        <Text className="text-neutral-400 mt-3">Health: {motor.health}%</Text>
      </View>

      {/* Komponen */}
      <View className="mb-6">
        <Text className="text-white font-maisonBold text-lg mb-3">Components</Text>

        {components.map((comp) => (
          <View
            key={comp.id}
            className="bg-[#212121] rounded-xl p-4 mb-3 flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-3">
              {comp.name === "Oil" ? (
                <Droplet size={20} color="#34D399" />
              ) : comp.name === "Spark Plug" ? (
                <Zap size={20} color="#FACC15" />
              ) : (
                <Wrench size={20} color="#EF4444" />
              )}
              <Text className="text-white font-maisonBold">{comp.name}</Text>
            </View>
            <Text className="text-neutral-400">{comp.value} km</Text>
          </View>
        ))}

        {/* Add Component Button */}
        <TouchableOpacity
          className="mb-4 border border-neutral-600 py-4 rounded-3xl flex-row justify-center items-center gap-2"
          onPress={handleAddComponent}
        >
          <Plus size={18} color="#fff" />
          <Text className="text-white font-maisonBold text-base">+ Add Component</Text>
        </TouchableOpacity>
      </View>

      {/* Action */}
      <TouchableOpacity className="bg-[#34D399] py-5 rounded-3xl shadow-2xl flex-row justify-center items-center gap-2">
        <Wrench size={22} color="#000" />
        <Text className="font-maisonBold text-black text-lg">Service Motor</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
