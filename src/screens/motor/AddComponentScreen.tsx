import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react-native';
import { addComponent } from '@/api/motorComponent/addComponents';
import { getComponents } from '@/api/motorComponent/getComponents';

export default function AddComponentScreen({ route, navigation }: any) {
  const { motorId } = route.params;

  const [name, setName] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !maxValue) return Alert.alert('Error', 'All fields are required');

    try {
      setLoading(true);

      // 🚫 VALIDASI DOUBLE
      const existing = await getComponents(motorId);
      const duplicate = existing.find(
        (c: any) => c.name.toLowerCase() === name.trim().toLowerCase()
      );

      if (duplicate) {
        Alert.alert('Duplicate', 'Component already exists');
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
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const canSave = name.trim().length > 0 && maxValue.trim().length > 0;

  return (
    <View className="flex-1 bg-[#0A0A0A] p-6">
      <View className="mb-8 flex-row items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="rounded-full border border-neutral-800 bg-[#161616] p-2.5">
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>
        <Text className="ml-4 font-maisonBold text-xl text-white">Add Component</Text>
      </View>

      <Text className="mb-2 font-maison text-sm text-neutral-300">Component Name</Text>
      <TextInput
        placeholder="cth: Oli, Busi, Kampas Rem"
        placeholderTextColor="#6B7280"
        value={name}
        onChangeText={setName}
        className="mb-5 rounded-2xl border border-neutral-800 bg-[#161616] px-4 py-4 font-maison text-white"
      />

      <Text className="mb-2 font-maison text-sm text-neutral-300">Max Value (km)</Text>
      <TextInput
        placeholder="cth: 5000"
        placeholderTextColor="#6B7280"
        keyboardType="numeric"
        value={maxValue}
        onChangeText={setMaxValue}
        className="rounded-2xl border border-neutral-800 bg-[#161616] px-4 py-4 font-maison text-white"
      />

      <TouchableOpacity
        onPress={handleSave}
        disabled={loading || !canSave}
        activeOpacity={0.85}
        className={`mt-8 items-center rounded-[24px] py-5 ${
          canSave ? 'bg-[#34D399]' : 'bg-[#2A2A2A]'
        }`}>
        <Text className={`font-maisonBold ${canSave ? 'text-[#052E2B]' : 'text-[#9CA3AF]'}`}>
          {loading ? 'Saving...' : 'Save Component'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
