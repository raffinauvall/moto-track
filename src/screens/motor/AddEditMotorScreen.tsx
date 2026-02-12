import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { ArrowLeft, ChevronDown } from "lucide-react-native";
import { useEffect, useState } from "react";
import { AddMotor } from "@/api/motor/addMotor";
import { UpdateMotor } from "@/api/motor/updateMotor";
import { getMotorModels } from "@/api/motor/getMotorModels";

export default function AddEditMotorScreen({ navigation, route }: any) {
  const motor = route.params?.motor;
  const isEdit = !!motor;

  const [models, setModels] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const data = await getMotorModels();
        setModels(data);

        if (motor) {
          const found = data.find(
            (m: any) => m.name === motor.name && m.brand === motor.brand
          );
          if (found) setSelected(found);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load motor models");
      }
    };

    loadModels();
  }, []);

  const handleSave = async () => {
    if (!selected) {
      Alert.alert("Warning", "Please choose motor first");
      return;
    }

    setLoading(true);

    try {
      if (isEdit) {
        await UpdateMotor(motor.id, selected.name, selected.brand);
      } else {
        await AddMotor(selected.name, selected.brand);
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to save motor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#131313] px-6 pt-14">
      {/* HEADER */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={26} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-maisonBold ml-4">
          {isEdit ? "Edit Motor" : "Add Motor"}
        </Text>
      </View>

      {/* LABEL */}
      <Text className="text-neutral-400 mb-2">Motor</Text>

      {/* SELECT */}
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        className="bg-[#212121] rounded-xl px-4 py-4 flex-row items-center justify-between"
      >
        <Text className="text-white">
          {selected
            ? `${selected.brand} - ${selected.name}`
            : "Choose motor"}
        </Text>
        <ChevronDown size={18} color="#aaa" />
      </TouchableOpacity>

      {open && (
        <View className="bg-[#212121] rounded-xl mt-2 max-h-64">
          <ScrollView>
            {models.map((m) => (
              <TouchableOpacity
                key={m.id}
                onPress={() => {
                  setSelected(m);
                  setOpen(false);
                }}
                className="px-4 py-4 border-b border-neutral-700"
              >
                <Text className="text-white">
                  {m.brand} – {m.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* SAVE */}
      <TouchableOpacity
        onPress={handleSave}
        disabled={loading || !selected}
        className={`py-5 rounded-3xl mt-10 ${
          selected ? "bg-[#34D399]" : "bg-neutral-600"
        }`}
      >
        <Text className="text-black font-maisonBold text-center text-lg">
          {loading ? "Saving..." : "Save Motor"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
