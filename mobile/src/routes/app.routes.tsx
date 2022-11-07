import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { New } from "../screens/New";
import { Pools } from "../screens/Pools";
import { Find } from "../screens/Find";
import { useTheme } from "native-base";
import { Platform } from "react-native";
import { Details } from "../screens/Details";

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  const { colors } = useTheme();
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: "beside-icon",
        tabBarActiveTintColor: colors.amber[100],
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          position: "absolute",
          height: 70,
          backgroundColor: colors.blueGray[700],
          borderTopWidth: 0,
        },
        tabBarItemStyle: {
          position: "relative",
          top: Platform.OS === "android" ? -10 : 10,
        },
      }}
    >
      <Screen
        name="new"
        component={New}
        options={{
          tabBarLabel: "Novo bolão",
          tabBarIcon: ({ color }) => (
            <AntDesign name="pluscircleo" color={color} size={24} />
          ),
        }}
      ></Screen>
      <Screen
        name="pools"
        component={Pools}
        options={{
          tabBarLabel: "Bolões",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="soccer-ball-o" size={24} color={color} />
          ),
        }}
      ></Screen>

      <Screen
        name="find"
        component={Find}
        options={{ tabBarButton: () => null }}
      ></Screen>

      <Screen
        name="details"
        component={Details}
        options={{ tabBarButton: () => null }}
      ></Screen>
    </Navigator>
  );
}
