import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ArrowLeft, ChevronDown, Check } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { addMotor } from '@/api/motor/addMotor';
import { updateMotor } from '@/api/motor/updateMotor';
import { getMotorModels } from '@/api/motor/getMotorModels';

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
          const found = data.find((m: any) => m.name === motor.name && m.brand === motor.brand);
          if (found) setSelected(found);
        }
      } catch {
        Alert.alert('Error', 'Failed to load motor models');
      }
    };

    loadModels();
  }, []);

  const handleSave = async () => {
    if (!selected) {
      Alert.alert('Warning', 'Please choose motor first');
      return;
    }

    setLoading(true);

    try {
      if (isEdit) {
        await updateMotor(motor.id, selected.name, selected.brand);
      } else {
        await addMotor(selected.name, selected.brand);
      }

      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to save motor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#0A0A0A] px-6 pt-14">
      {/* HEADER */}
      <View className="mb-8 flex-row items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="rounded-full border border-neutral-800 bg-[#161616] p-2.5">
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>
        <Text className="ml-4 font-maisonBold text-xl text-white">
          {isEdit ? 'Edit Motor' : 'Add Motor'}
        </Text>
      </View>

      {/* LABEL */}
      <Text className="mb-2 font-maison text-sm text-neutral-300">Motor</Text>

      {/* SELECT */}
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        activeOpacity={0.85}
        className="flex-row items-center justify-between rounded-2xl border border-neutral-800 bg-[#161616] px-4 py-4">
        <Text className={selected ? 'font-maison text-white' : 'font-maison text-neutral-500'}>
          {selected ? `${selected.brand} - ${selected.name}` : 'Choose motor'}
        </Text>
        <ChevronDown size={18} color="#aaa" />
      </TouchableOpacity>

      {open && (
        <View className="mt-2 max-h-64 overflow-hidden rounded-2xl border border-neutral-800 bg-[#161616]">
          <ScrollView>
            {models.map((m) => (
              <TouchableOpacity
                key={m.id}
                onPress={() => {
                  setSelected(m);
                  setOpen(false);
                }}
                activeOpacity={0.7}
                className="flex-row items-center justify-between border-b border-neutral-800 px-4 py-4">
                <Text className="font-maison text-white">
                  {m.brand} – {m.name}
                </Text>
                {selected?.id === m.id && <Check size={18} color="#34D399" />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* SAVE */}
      <TouchableOpacity
        onPress={handleSave}
        disabled={loading || !selected}
        activeOpacity={0.85}
        className={`mt-10 rounded-[24px] py-5 ${selected ? 'bg-[#34D399]' : 'bg-[#2A2A2A]'}`}>
        <Text
          className={`text-center font-maisonBold text-lg ${
            selected ? 'text-[#052E2B]' : 'text-[#9CA3AF]'
          }`}>
          {loading ? 'Saving...' : 'Save Motor'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
