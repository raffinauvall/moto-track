import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { AddMotor } from "@/api/motor/addMotor";
import { UpdateMotor } from "@/api/motor/updateMotor";

export default function AddEditMotorScreen({ navigation, route }: any) {
  const onSave = route.params?.onSave;
  const motor = route.params?.motor; // 🔥 motor lama (kalau edit)
  const isEdit = !!motor;

  const [name, setName] = useState(motor?.name ?? "");
  const [brand, setBrand] = useState(motor?.brand ?? "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !brand) return;

    setLoading(true);

    // ======================
    // 🔹 EDIT MODE
    // ======================
    if (isEdit) {
      const updatedMotor = {
        ...motor,
        name,
        brand,
      };

      // 🔥 optimistic update
      onSave(updatedMotor);

      try {
        await UpdateMotor(motor.id, name, brand);
        navigation.goBack();
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }

      return;
    }

    // ======================
    // 🔹 ADD MODE (KODE LAMAMU)
    // ======================
    const tempId = `temp-${Date.now()}`;

    onSave({
      id: tempId,
      name,
      brand,
      temp: true,
    });

    try {
      const newMotor = await AddMotor(name, brand);
      onSave(newMotor, tempId);
      navigation.goBack();
    } catch (err) {
      console.log(err);
      onSave(null, tempId); // rollback
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#131313] px-6 pt-14">
      <View className="flex-row items-center mb-8">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={26} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-maisonBold ml-4">
          {isEdit ? "Edit Motor" : "Add Motor"}
        </Text>
      </View>

      <Text className="text-neutral-400 mb-2">Motor Name</Text>
      <TextInput
        className="bg-[#212121] rounded-xl px-4 py-4 text-white mb-5"
        value={name}
        onChangeText={setName}
      />

      <Text className="text-neutral-400 mb-2">Brand</Text>
      <TextInput
        className="bg-[#212121] rounded-xl px-4 py-4 text-white"
        value={brand}
        onChangeText={setBrand}
      />

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
