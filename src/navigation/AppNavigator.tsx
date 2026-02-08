import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import WelcomeScreen from "../screens/auth/WelcomeScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import MotorDetailScreen from "../screens/motor/MotorDetailScreen";
import AddEditMotorScreen from "../screens/motor/AddEditMotorScreen";
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

        {/* Main App */}
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

        {/* Motor Flow */}
        <Stack.Screen
          name="MotorDetail"
          component={MotorDetailScreen}
        />
        <Stack.Screen
          name="AddEditMotor"
          component={AddEditMotorScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
