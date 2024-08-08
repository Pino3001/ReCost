import 'react-native-gesture-handler';
import { StyleSheet, Pressable, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';
import Colors from '../styles/color';

type ProductosProps = {
  navigation: NavigationProp<any>;
};

const Productos: React.FC<ProductosProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => {
          navigation.navigate('NuevoProducto');
        }}
      >
        <Text style={styles.text}>Nuevo Producto</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => {
          navigation.navigate('BuscarProducto');
        }}
      >
        <Text style={styles.text}>Buscar Producto</Text>
      </Pressable>
    </SafeAreaView>
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

export default Productos;
