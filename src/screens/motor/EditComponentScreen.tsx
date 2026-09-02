import { View, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ArrowLeft, Trash2, Save } from 'lucide-react-native';
import { useState } from 'react';
import { updateComponentValue } from '@/api/motorComponent/updateComponentValue';
import { deleteComponent } from '@/api/motorComponent/deleteComponent';

export default function EditComponentScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { component } = route.params;

  const [currentValue, setCurrentValue] = useState(String(component.current_value));
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const value = Number(currentValue);

    if (isNaN(value)) {
      Alert.alert('Invalid value', 'Masukkan angka yang valid');
      return;
    }

    if (value < 0 || value > component.max_value) {
      Alert.alert('Invalid value', `Nilai harus antara 0 - ${component.max_value}`);
      return;
    }

    try {
      setLoading(true);
      await updateComponentValue(component.id, value);
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Component', 'Yakin mau hapus component ini?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteComponent(component.id);
            navigation.goBack();
          } catch (err: any) {
            Alert.alert('Error', err.message);
          }
        },
      },
    ]);
  };

  const ratio = component.max_value > 0 ? component.current_value / component.max_value : 0;
  const color = ratio >= 0.8 ? '#EF4444' : ratio >= 0.5 ? '#FACC15' : '#22C55E';

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A', padding: 24 }}>
      {/* ================= HEADER ================= */}
      <View className="mb-8 flex-row items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="rounded-full border border-neutral-800 bg-[#161616] p-2.5">
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>
        <Text className="ml-4 font-maisonBold text-xl text-white">Edit Component</Text>
      </View>

      {/* ================= CARD ================= */}
      <View className="mb-8 rounded-[24px] bg-[#161616] p-5">
        <Text className="font-maisonBold text-2xl text-white">{component.name}</Text>
        <Text className="mt-2 font-maison text-sm text-neutral-500">
          Max Value: {component.max_value} km
        </Text>

        <View className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#2A2A2A]">
          <View
            className="h-full rounded-full"
            style={{ width: `${Math.min(ratio * 100, 100)}%`, backgroundColor: color }}
          />
        </View>

        <Text className="mb-2 mt-5 font-maison text-sm text-neutral-400">Current Value</Text>
        <TextInput
          value={currentValue}
          onChangeText={setCurrentValue}
          keyboardType="numeric"
          className="rounded-xl border border-neutral-800 bg-[#0A0A0A] px-4 py-3 font-maison text-white"
        />
      </View>

      {/* ================= SAVE ================= */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleSave}
        disabled={loading}
        className="mb-4 flex-row items-center justify-center gap-2 rounded-[24px] bg-[#34D399] py-5">
        <Save size={20} color="#052e2b" />
        <Text className="font-maisonBold text-[#052e2b]">Save Changes</Text>
      </TouchableOpacity>

      {/* ================= DELETE ================= */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleDelete}
        className="flex-row items-center justify-center gap-2 rounded-[24px] border border-red-500/20 bg-[#1E1E1E] py-5">
        <Trash2 size={20} color="#EF4444" />
        <Text className="font-maisonBold text-[#EF4444]">Delete Component</Text>
      </TouchableOpacity>
    </View>
  );
}
