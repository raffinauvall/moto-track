import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { ArrowLeft, Trash2, Save } from "lucide-react-native";
import { useState } from "react";
import { deleteComponents } from "@/api/motorComponent/deleteComponents";
import { updateComponents } from "@/api/motorComponent/updateComponents";

export default function EditComponentScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { component } = route.params;

  const [currentValue, setCurrentValue] = useState(
    String(component.current_value)
  );
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const value = Number(currentValue);

    if (isNaN(value)) {
      Alert.alert("Invalid value", "Masukkan angka yang valid");
      return;
    }

    if (value < 0 || value > component.max_value) {
      Alert.alert(
        "Invalid value",
        `Nilai harus antara 0 - ${component.max_value}`
      );
      return;
    }

    try {
      setLoading(true);
      await updateComponents(component.id, value);
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Component",
      "Yakin mau hapus component ini?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteComponents(component.id);
              navigation.goBack();
            } catch (err: any) {
              Alert.alert("Error", err.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#131313", padding: 24 }}>
      {/* ================= HEADER ================= */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={26} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-xl ml-4">
          Edit Component
        </Text>
      </View>

      {/* ================= CARD ================= */}
      <View className="bg-[#212121] rounded-2xl p-5 mb-6">
        <Text className="text-white text-2xl font-semibold">
          {component.name}
        </Text>

        <Text className="text-neutral-400 mt-2">
          Max Value: {component.max_value}
        </Text>

        <Text className="text-neutral-400 mb-2">
          Current Value
        </Text>

        <TextInput
          value={currentValue}
          onChangeText={setCurrentValue}
          keyboardType="numeric"
          className="bg-[#131313] text-white rounded-xl px-4 py-3"
        />
      </View>

      {/* ================= SAVE ================= */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleSave}
        disabled={loading}
        className="bg-[#34D399] rounded-3xl py-5 flex-row items-center justify-center gap-2 mb-4"
      >
        <Save size={20} color="#052e2b" />
        <Text className="text-[#052e2b] font-bold">
          Save Changes
        </Text>
      </TouchableOpacity>

      {/* ================= DELETE ================= */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleDelete}
        className="bg-red-500 rounded-3xl py-5 flex-row items-center justify-center gap-2"
      >
        <Trash2 size={20} color="#fff" />
        <Text className="text-white font-bold">
          Delete Component
        </Text>
      </TouchableOpacity>
    </View>
  );
}
