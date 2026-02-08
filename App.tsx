import HomeScreen from "@/screens/home/HomeScreen";
import "./global.css";
import AppNavigator from "./src/navigation/AppNavigator";
import { useFonts } from "expo-font";
import BottomTabNavigator from "@/navigation/BottomTabNavigator";
import { NavigationContainer } from "@react-navigation/native";


export default function App() {
  const [fontsLoaded] = useFonts({
    "MaisonNeue-Light": require("./assets/fonts/maison/Maison_Neue_Light.ttf"),
    "MaisonNeue-Book": require("./assets/fonts/maison/Maison_Neue_Book.ttf"),
    "MaisonNeue-Bold": require("./assets/fonts/maison/Maison_Neue_Bold.ttf"),
    "MaisonNeue-Mono": require("./assets/fonts/maison/Maison_Neue_Mono.ttf"),
  });

   return <AppNavigator/>
  
}
