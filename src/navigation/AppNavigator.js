import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import ProfileScreen from "../screens/ProfileScreen";
import PsychologistListScreen from "../screens/PsychologistListScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: "#3498db" }, // COLORS.primary
          headerTintColor: "#ffffff", // COLORS.white
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Bem-vindo ao OzSafe" }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "Crie sua Conta" }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Início" }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: "Meu Perfil" }}
        />
        <Stack.Screen
          name="PsychologistList"
          component={PsychologistListScreen}
          options={{ title: "Psicólogos Disponíveis" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
