import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { ArrowLeft, Check } from "lucide-react-native";
import { useEffect, useState } from "react";
import { getComponents } from "@/api/motorComponent/getComponents";
import { createService } from "@/api/service/createService";
import { ToastService } from "@/utils/toastService";

export default function ServiceMotorScreen({ route, navigation }: any) {
  const motorId = route?.params?.motorId;
  const motorName = route?.params?.motorName;

  const [components, setComponents] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      const data = await getComponents(motorId);
      setComponents(data || []);
    } catch (e) {
      Alert.alert("Error", "Gagal memuat komponen");
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const submitService = async () => {
    if (!selected.length) {
      Alert.alert("Pilih minimal satu komponen");
      return;
    }

    setLoading(true);
    try {
      const serviced = components.filter((c) => selected.includes(c.id));
      const serviceType =
        serviced.length <= 2 ? "Service Ringan" : "Service Berat";

      await createService({
        motorId,
        motorName,
        serviceType,
        components: serviced,
      });

      const updatedComponents = await getComponents(motorId);
      setComponents(updatedComponents || []);

      ToastService.show("success", "Service berhasil 🚀");
      navigation.goBack();
    } catch (e) {
      console.error(e);
      ToastService.show("error", "Gagal menyimpan service");
    } finally {
      setLoading(false);
    }
  };

  if (!motorId) {
    return (
      <View className="flex-1 bg-[#131313] items-center justify-center">
        <Text className="text-white">Motor tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#131313]">
      <ScrollView className="px-6 pt-6">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={26} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-xl ml-4">
            Service {motorName}
          </Text>
        </View>

        {components.map((c) => {
          const checked = selected.includes(c.id);
          return (
            <TouchableOpacity
              key={c.id}
              onPress={() => toggleSelect(c.id)}
              className="bg-[#212121] rounded-2xl p-4 mb-3 flex-row justify-between"
            >
              <View>
                <Text className="text-white">{c.name}</Text>
                <Text className="text-neutral-400 text-xs">
                  {c.current_value} / {c.max_value}
                </Text>
              </View>
              {checked && <Check size={20} color="#34D399" />}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          onPress={submitService}
          disabled={loading}
          className="mt-6 bg-[#34D399] rounded-3xl py-5 items-center"
        >
          <Text className="font-bold">Simpan Service</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
