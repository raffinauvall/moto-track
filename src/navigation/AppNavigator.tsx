import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator from "./BottomTabNavigator";

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

const Stack = createNativeStackNavigator();

export default function AppNavigator({ user }: { user: any }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
          <Stack.Screen name="MotorDetail" component={MotorDetailScreen} />
          <Stack.Screen name="AddEditMotor" component={AddEditMotorScreen} />
          <Stack.Screen name="AddComponent" component={AddComponentScreen} />
          <Stack.Screen name="EditComponent" component={EditComponentScreen} />
          <Stack.Screen name="ServiceMotor" component={ServiceMotorScreen} />
          <Stack.Screen name="HistoryMotor" component={HistoryMotorScreen} />
          <Stack.Screen name="HistoryMotorDetail" component={HistoryMotorDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
