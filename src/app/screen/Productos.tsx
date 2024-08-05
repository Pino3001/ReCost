import 'react-native-gesture-handler';
import { StyleSheet, Pressable, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';

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
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 120,
    paddingHorizontal: 30,
    margin: 20,
    borderRadius: 15,
    elevation: 3,
    backgroundColor: "#c56d",
  },
  text: {
    fontSize: 20,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
});

export default Productos;
