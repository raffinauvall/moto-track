import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";

export default function AddEditMotorScreen({ navigation, route }: any) {
  const motor = route.params?.motor;
  const onSave = route.params?.onSave;

  const [name, setName] = useState(motor?.name || "");
  const [health, setHealth] = useState(
    motor?.health?.toString() || "100"
  );

  const handleSave = () => {
    if (!name || !health) return;

    onSave({
      id: motor?.id || Date.now(),
      name,
      health: Number(health),
    });

    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-[#131313] px-6 pt-14">
      {/* Header */}
      <View className="flex-row items-center mb-8">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={26} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-maisonBold ml-4">
          {motor ? "Edit Motor" : "Add Motor"}
        </Text>
      </View>

      {/* Name */}
      <Text className="text-neutral-400 mb-2">Motor Name</Text>
      <TextInput
        className="bg-[#212121] rounded-xl px-4 py-4 text-white mb-5"
        placeholder="e.g. Yamaha NMAX"
        placeholderTextColor="#666"
        value={name}
        onChangeText={setName}
      />

      {/* Health */}
      <Text className="text-neutral-400 mb-2">Health (%)</Text>
      <TextInput
        className="bg-[#212121] rounded-xl px-4 py-4 text-white"
        placeholder="0 - 100"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={health}
        onChangeText={setHealth}
      />

      {/* Save */}
      <TouchableOpacity
        onPress={handleSave}
        className="bg-[#34D399] py-5 rounded-3xl mt-10"
      >
        <Text className="text-black font-maisonBold text-center text-lg">
          Save Motor
        </Text>
      </TouchableOpacity>
    </View>
  );
}
