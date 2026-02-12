import HomeScreen from "@/screens/home/HomeScreen";
import "./global.css";
import AppNavigator from "./src/navigation/AppNavigator";
import { useFonts } from "expo-font";
import BottomTabNavigator from "@/navigation/BottomTabNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { ActiveMotorProvider } from "@/context/ActiveMotorContext";
import { useState } from "react";
import { ToastService } from "@/utils/toastService";
import CustomToast from "@/components/CustomToast";


export default function App() {
  const [fontsLoaded] = useFonts({
    "MaisonNeue-Light": require("./assets/fonts/maison/Maison_Neue_Light.ttf"),
    "MaisonNeue-Book": require("./assets/fonts/maison/Maison_Neue_Book.ttf"),
    "MaisonNeue-Bold": require("./assets/fonts/maison/Maison_Neue_Bold.ttf"),
    "MaisonNeue-Mono": require("./assets/fonts/maison/Maison_Neue_Mono.ttf"),
  });
  const [toast, setToast] = useState<{ type: "success" | "error"; title: string; message: string; } | null>(null);
  ToastService.register((type, title, message) => {
    setToast({ type, title, message: message || "" });
  });


  return (
    <ActiveMotorProvider>
      <AppNavigator />

      {toast && (
        <CustomToast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onHide={() => setToast(null)}
        />
      )}
    </ActiveMotorProvider>
  );

}
