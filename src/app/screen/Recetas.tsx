import React from "react";
import "react-native-gesture-handler";
import { StyleSheet, Pressable, View, Text } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import Colors from "../styles/color";
type RecetasProps = {
  navigation: NavigationProp<any>;
};

const Recetas: React.FC<RecetasProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => {
          navigation.navigate('NuevaReceta');
        }}
      >
        <Text style={styles.text}>Nueva Receta</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => {
          navigation.navigate('BuscarReceta');
        }}
      >
        <Text style={styles.text}>Buscar Receta</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: '50%',
    height: '40%',
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    borderWidth:2,
    borderRadius: 40,
    borderColor:Colors.primary,
  },
  text: {
    fontSize: 20,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: Colors.primary,
  },
});

export default Recetas;
