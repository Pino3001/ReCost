import React from "react";
import "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import Colors from "../styles/color";
import * as Font from 'expo-font';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Importar pantallas
import Productos from "../screen/Productos";
import Recetas from "../screen/Recetas";
import NuevaReceta from "../screen/NuevaReceta";
import BuscarReceta from "../screen/BuscarReceta";
import NuevoProducto from "../screen/NuevoProducto";
import BuscarProducto from "../screen/BuscarProducto";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="RecetasTab"
        component={MyStackRecetas}
        options={{
          title: 'Recetas',
          tabBarIcon: () => <Entypo name="open-book" size={24} color={Colors.primary} />,
          tabBarStyle: { borderColor: Colors.primary },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.text,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ProductosTab"
        component={MyStackProductos}
        options={{
          title: 'Productos',
          tabBarIcon: () => <FontAwesome5 name="store-alt" size={24} color={Colors.primary} />,
          tabBarStyle: { borderColor: Colors.primary },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.text,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

function MyStackRecetas() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.notificaciones,
        },
        headerTintColor: Colors.primary,
        headerTitleStyle: {
          fontFamily: 'Sanches-Regular',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen name="RecetasScreen" component={Recetas} options={{ title: 'Recetas' }} />
      <Stack.Screen name="NuevaReceta" component={NuevaReceta} options={{ title: 'Nueva Receta' }}/>
      <Stack.Screen name="BuscarReceta" component={BuscarReceta} options={{ title: 'Buscar Recetas' }}/>
    </Stack.Navigator>
  );
}

function MyStackProductos() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.notificaciones,
        },
        headerTintColor: Colors.primary,
        headerTitleStyle: {
          fontFamily: 'Sanches-Regular',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen name="ProductosScreem" component={Productos} options={{ title: 'Productos' }} />
      <Stack.Screen name="NuevoProducto" component={NuevoProducto} />
      <Stack.Screen name="BuscarProducto" component={BuscarProducto} />
    </Stack.Navigator>
  );
}

const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
};

export default Navigation;
