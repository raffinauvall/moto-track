import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { AddMotor } from "@/api/motor/addMotor";

export default function AddEditMotorScreen({ navigation, route }: any) {
  const onSave = route.params?.onSave;

  const [name, setName] = useState("");
  const [brand, setBrand] = useState(""); // tambah brand
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !brand) return; // health dihapus, pakai brand

    setLoading(true);
    const tempId = `temp-${Date.now()}`;

    // Optimistic motor
    onSave({
      id: tempId,
      name,
      brand,
      temp: true,
    });

    try {
      // Insert motor + default components
      const motor = await AddMotor(name, brand);

      // Replace temp motor dengan data asli
      onSave(motor, tempId);

      navigation.goBack();
    } catch (err) {
      console.log(err);

      // Rollback optimistic
      onSave(null, tempId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#131313] px-6 pt-14">
      {/* Header */}
      <View className="flex-row items-center mb-8">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={26} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-maisonBold ml-4">
          Add Motor
        </Text>
      </View>

      {/* Motor Name */}
      <Text className="text-neutral-400 mb-2">Motor Name</Text>
      <TextInput
        className="bg-[#212121] rounded-xl px-4 py-4 text-white mb-5"
        placeholder="e.g. NMAX"
        placeholderTextColor="#666"
        value={name}
        onChangeText={setName}
      />

      {/* Brand */}
      <Text className="text-neutral-400 mb-2">Brand</Text>
      <TextInput
        className="bg-[#212121] rounded-xl px-4 py-4 text-white"
        placeholder="Yamaha / Honda / Suzuki"
        placeholderTextColor="#666"
        value={brand}
        onChangeText={setBrand}
      />

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSave}
        disabled={loading}
        className={`bg-[#34D399] py-5 rounded-3xl mt-10 ${
          loading ? "opacity-60" : ""
        }`}
      >
        <Text className="text-black font-maisonBold text-center text-lg">
          {loading ? "Saving..." : "Save Motor"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
