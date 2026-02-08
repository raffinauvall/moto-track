import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { AddMotor } from "@/api/motor/addMotor";

export default function AddEditMotorScreen({ navigation, route, user }: any) {
  const onSave = route.params?.onSave;

  const [name, setName] = useState("");
  const [health, setHealth] = useState("100");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !health) return;

    setLoading(true);

    // 1️⃣ Optimistic UI: buat motor sementara
    const tempMotor = {
      id: Date.now(), // temporary ID
      name,
      health: Number(health),
    };
    onSave(tempMotor); // langsung tampil di list

    try {
      // 2️⃣ Insert motor + default components ke Supabase
      const motor = await AddMotor(user.id, name, Number(health));

      // 3️⃣ Update state lagi kalau mau pakai ID asli dari DB
      onSave(motor);
    } catch (err) {
      console.log(err);
      // optional: rollback UI kalau error
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

  return (
    <View className="flex-1 bg-[#131313] px-6 pt-14">
      {/* Header */}
      <View className="flex-row items-center mb-8">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={26} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-maisonBold ml-4">Add Motor</Text>
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
        className={`bg-[#34D399] py-5 rounded-3xl mt-10 ${loading ? "opacity-60" : ""}`}
        disabled={loading}
      >
        <Text className="text-black font-maisonBold text-center text-lg">
          {loading ? "Saving..." : "Save Motor"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
