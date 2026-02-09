import { View, Text, TouchableOpacity } from "react-native";
import { Motorbike } from "lucide-react-native";

type Props = {
  motor: string;
  onChangeMotor?: () => void; // sekarang optional
};

export default function MotorCard({ motor, onChangeMotor }: Props) {
  return (
    <View className="bg-[#212121] p-5 mb-5 rounded-3xl shadow-xl">
      
      {/* Header */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          <Motorbike color="#34D399" size={22} />
          <Text className="text-neutral-400 font-maison text-sm">
            Active Motor
          </Text>
        </View>

        {/* Tombol Change hanya muncul jika ada onChangeMotor */}
        {onChangeMotor && (
          <TouchableOpacity onPress={onChangeMotor}>
            <Text className="text-[#34D399] font-maisonBold text-xs">
              Change
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Nama Motor */}
      <Text className="text-white font-maisonBold text-2xl">
        {motor || "No Active Motor"}
      </Text>
    </View>
  );
}
