import { Box } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { SignIn } from "../screens/SignIn";
import { AppRoutes } from "./app.routes";
import { useAuth } from "../hooks/useAuth";

export function Routes() {
  const { user } = useAuth();
  return (
    <Box flex={1} bg="blueGray.900">
      <NavigationContainer>
        {user.name ? <AppRoutes /> : <SignIn />}
      </NavigationContainer>
    </Box>
  );
}
