import React, { useEffect, useState } from "react";
import "./global.css";
import { useFonts } from "expo-font";
import { ActiveMotorProvider } from "@/context/ActiveMotorContext";
import { supabase } from "@/api/supabaseClient";
import AppNavigator from "./src/navigation/AppNavigator";
import CustomToast from "@/components/CustomToast";
import { ToastService } from "@/utils/toastService";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  const [fontsLoaded] = useFonts({
    "MaisonNeue-Light": require("./assets/fonts/maison/Maison_Neue_Light.ttf"),
    "MaisonNeue-Book": require("./assets/fonts/maison/Maison_Neue_Book.ttf"),
    "MaisonNeue-Bold": require("./assets/fonts/maison/Maison_Neue_Bold.ttf"),
    "MaisonNeue-Mono": require("./assets/fonts/maison/Maison_Neue_Mono.ttf"),
  });

  const [user, setUser] = useState<any>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; title: string; message: string } | null>(null);

  useEffect(() => {
    ToastService.register((type, title, message) => {
      setToast({ type, title, message: message || "" });
    });
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <ActiveMotorProvider>
      <NavigationContainer>

        <AppNavigator user={user} />
      </NavigationContainer>

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
