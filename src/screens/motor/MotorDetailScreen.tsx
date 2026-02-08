import { View, Text, TouchableOpacity } from "react-native";
import { ArrowLeft, Droplet, Zap, Wrench } from "lucide-react-native";
import CircularWidget from "@/components/home/CircularStats";

// helper status
const getStatus = (value: number) => {
  if (value >= 80)
    return { label: "GOOD", color: "#22C55E", note: "Ready for daily use" };
  if (value >= 50)
    return { label: "WARNING", color: "#FACC15", note: "Maintenance recommended soon" };
  return { label: "SERVICE", color: "#EF4444", note: "Immediate service is recommended" };
};

export default function MotorDetailScreen({ route, navigation }: any) {
  const { motor } = route.params;
  const status = getStatus(motor.health);

  return (
    <View className="flex-1 bg-[#131313] px-6 pt-14">

      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={26} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-maisonBold ml-4">
          Motor Detail
        </Text>
      </View>

      {/* Motor Card */}
      <View className="bg-[#212121] rounded-2xl p-5 mb-6">
        <Text className="text-white text-2xl font-maisonBold">
          {motor.name}
        </Text>

        <View className="flex-row items-center mt-2">
          <Text
            className="font-maisonBold text-sm"
            style={{ color: status.color }}
          >
            {status.label}
          </Text>
          <Text className="text-neutral-400 text-sm ml-2">
            • {status.note}
          </Text>
        </View>

        <Text className="text-neutral-400 mt-3">
          Health: {motor.health}%
        </Text>
      </View>

      {/* Stats */}
      <View className="flex-row gap-4 mb-8">
        <CircularWidget
          current={500}
          max={2000}
          label="Oil Change"
          color="#34D399"
          Icon={Droplet}
        />
        <CircularWidget
          current={236}
          max={10000}
          label="Spark Plug"
          color="#FACC15"
          Icon={Zap}
        />
      </View>

      {/* Action */}
    <TouchableOpacity
     className="mb-4 border border-neutral-600 py-4 rounded-3xl flex-row justify-center items-center gap-2"
     onPress={() => navigation.navigate("AddComponent", { motorId: motor.id })}>
     <Text className="text-white font-maisonBold text-base">
        + Add Component
     </Text>
    </TouchableOpacity>

    <TouchableOpacity className="bg-[#34D399] py-5 rounded-3xl shadow-2xl flex-row justify-center items-center gap-2">
     <Wrench size={22} color="#000" />
     <Text className="font-maisonBold text-black text-lg">
          Service Motor
     </Text>
    </TouchableOpacity>

    </View>
  );
}
