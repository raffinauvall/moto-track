import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ArrowLeft, ChevronDown } from "lucide-react-native";
import { useEffect, useState } from "react";
import { AddMotor } from "@/api/motor/addMotor";
import { UpdateMotor } from "@/api/motor/updateMotor";
import { getMotorModels } from "@/api/motor/getMotorModels";

export default function AddEditMotorScreen({ navigation, route }: any) {
  const onSave = route.params?.onSave;
  const motor = route.params?.motor;
  const isEdit = !!motor;

  const [models, setModels] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMotorModels().then((data) => {
      setModels(data);

      if (motor) {
        const found = data.find(
          (m: any) => m.name === motor.name && m.brand === motor.brand
        );
        if (found) setSelected(found);
      }
    });
  }, []);

  const handleSave = async () => {
    if (!selected) return;
    setLoading(true);

    try {
      if (isEdit) {
        const updated = {
          ...motor,
          name: selected.name,
          brand: selected.brand,
        };

        onSave(updated);
        await UpdateMotor(motor.id, selected.name, selected.brand);
        navigation.goBack();
        return;
      }

      const tempId = `temp-${Date.now()}`;
      onSave({
        id: tempId,
        name: selected.name,
        brand: selected.brand,
        temp: true,
      });

      const newMotor = await AddMotor(selected.name, selected.brand);
      onSave(newMotor, tempId);
      navigation.goBack();
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

      {/* INPUT */}
      <Text className="text-neutral-400 mb-2">Motor</Text>
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

      {/* DROPDOWN */}
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
        disabled={loading}
        className="bg-[#34D399] py-5 rounded-3xl mt-10"
      >
        <Text className="text-black font-maisonBold text-center text-lg">
          {loading ? "Saving..." : "Save Motor"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
