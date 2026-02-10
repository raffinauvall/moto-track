import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import WelcomeScreen from "../screens/auth/WelcomeScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";

import MotorDetailScreen from "../screens/motor/MotorDetailScreen";
import AddEditMotorScreen from "../screens/motor/AddEditMotorScreen";
import AddComponentScreen from "@/screens/motor/AddComponentScreen";
import EditComponentScreen from "@/screens/motor/EditComponentScreen";

import ServiceMotorScreen from "../screens/service/ServiceMotorScreen";
import HistoryMotorScreen from "../screens/service/HistoryServiceScreen";
import HistoryMotorDetailScreen from "../screens/service/HistoryMotorDetailScreen";


import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* Auth */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Main */}
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

        {/* Motor */}
        <Stack.Screen name="MotorDetail" component={MotorDetailScreen} />
        <Stack.Screen name="AddEditMotor" component={AddEditMotorScreen} />
        <Stack.Screen name="AddComponent" component={AddComponentScreen} />
        <Stack.Screen name="EditComponent" component={EditComponentScreen} />

        {/* Service */}
        

        <Stack.Screen name="ServiceMotor" component={ServiceMotorScreen} />
        <Stack.Screen name="HistoryMotor" component={HistoryMotorScreen} />
        <Stack.Screen
         name="HistoryMotorDetail"
          component={HistoryMotorDetailScreen}
        />


      </Stack.Navigator>
    </NavigationContainer>
  );
}
