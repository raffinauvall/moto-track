import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { ArrowLeft } from "lucide-react-native";
import { addComponent } from "@/api/motorComponent/addComponents";
import { getComponents } from "@/api/motorComponent/getComponents";

export default function AddComponentScreen({ route, navigation }: any) {
  const { motorId } = route.params;

  const [name, setName] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !maxValue)
      return Alert.alert("Error", "All fields are required");

    try {
      setLoading(true);

      // 🚫 VALIDASI DOUBLE
      const existing = await getComponents(motorId);
      const duplicate = existing.find(
        (c: any) =>
          c.name.toLowerCase() === name.trim().toLowerCase()
      );

      if (duplicate) {
        Alert.alert("Duplicate", "Component already exists");
        return;
      }

      await addComponent({
        motor_id: motorId,
        name: name.trim(),
        max_value: Number(maxValue),
        current_value: 0,
      });

      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#131313] p-6">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={26} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-xl ml-4">Add Component</Text>
      </View>

      <TextInput
        placeholder="Component Name"
        placeholderTextColor="#6B7280"
        value={name}
        onChangeText={setName}
        className="bg-[#212121] text-white rounded-2xl px-4 py-4 mb-4"
      />

      <TextInput
        placeholder="Max Value"
        placeholderTextColor="#6B7280"
        keyboardType="numeric"
        value={maxValue}
        onChangeText={setMaxValue}
        className="bg-[#212121] text-white rounded-2xl px-4 py-4"
      />

      <TouchableOpacity
        onPress={handleSave}
        disabled={loading}
        className="mt-6 bg-[#34D399] rounded-3xl py-5 items-center"
      >
        <Text className="text-[#052e2b] font-bold">
          {loading ? "Saving..." : "Save Component"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
