import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/home/HomeScreen";
import { Home, Clock, User, Bike } from "lucide-react-native";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false, // ❌ hapus tulisan
                tabBarActiveTintColor: "#34D399",
                tabBarInactiveTintColor: "#9CA3AF",
                tabBarStyle: {
                    position: "absolute",
                    marginHorizontal: 30,
                    bottom: 20,
                    left: 20,
                    right: 20,
                    elevation: 5,
                    backgroundColor: "#212121",
                    borderRadius: 25,
                    height: 70,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.1,
                    shadowRadius: 5,
                    borderTopWidth: 0,
                    paddingHorizontal: 10,
                    paddingVertical: 30,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Home color={color} size={28} style={{ marginTop: 35 }} />
                    ),
                }}
            />
            <Tab.Screen
                name="Motor"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Bike color={color} size={28} style={{ marginTop: 35 }} />
                    ),
                }}
            />
            <Tab.Screen
                name="History"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Clock color={color} size={28} style={{ marginTop: 35 }} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <User color={color} size={28} style={{ marginTop: 35 }} />
                    ),
                }}
            />

        </Tab.Navigator>
    );
}
