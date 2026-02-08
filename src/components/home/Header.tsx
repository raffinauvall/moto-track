import { Bell } from "lucide-react-native"
import { View, Text, TouchableOpacity } from "react-native"

export default function Header(){
    return(
       
                    <View className="flex-row items-center justify-between mb-8 pt-4">
                        <View className="">
                            <Text className="text-gray-500 mb-1">Welcome Back</Text>
                            <Text className="text-white text-2xl font-maisonBold" adjustsFontSizeToFit>Raffi Nauval</Text>
                        </View>
                        <View>
                            <TouchableOpacity className="p-3 border border-gray-500 rounded-[10px]">
                                <Bell size={20} color="#ffffff" />
                            </TouchableOpacity>
                        </View>
                    </View>
    )
}