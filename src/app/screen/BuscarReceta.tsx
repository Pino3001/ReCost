import 'react-native-gesture-handler';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { operReceta, RecetaDatabase } from '../../databse/operRecetaDB';
import { FlatList } from 'react-native-gesture-handler';
import { FontAwesome5 } from "@expo/vector-icons";
import { ItemReceta } from '../componentes/ItemReceta';
import Colors from '../styles/color';

// Define las propiedades del componente Item
interface ItemProps {
  title: string;
}

// Componente para renderizar cada ítem
const Item: React.FC<ItemProps> = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

export default function BuscarReceta() {
  const [recetas, setRecetas] = useState<RecetaDatabase[]>([]);
  const [loading, setLoading] = useState(true);
  const [buscarReceta, setBuscarReceta] = useState(false);
  const [filtrarReceta, setFiltrarReceta] = useState(false);
  const navigation = useNavigation();
  const { showRecetas } = operReceta();


  // Función para cargar los productos
  const loadRecetas = async () => {
    try {
      const listaRecetas = await showRecetas();
      setRecetas(listaRecetas);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        buscarReceta ? (
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar receta..."
          />
        ) : (
          <Text style={styles.headerTitleStyle}>Buscar Receta</Text>
        )
      ),
      headerRight: () => (
        <SafeAreaView style={styles.headerRightContainer}>
          <View style={styles.headerRightContainer}>
            <FontAwesome5
              name="searchengin"
              onPress={() => setBuscarReceta(!buscarReceta)}
              size={24}
              style={styles.search}
            />
            <FontAwesome5
              name="filter"
              size={24}
              color="#f44495"
              style={styles.filtrar}
            />
          </View>
        </SafeAreaView>
      )
    });
  }, [navigation, buscarReceta]);



  // Llama a la función loadProducts al montar el componente
  useEffect(() => {
    loadRecetas();
  }, []);



  // Renderiza un mensaje de carga mientras se obtienen los datos
  if (loading) {
    return <Text style={styles.loading}>Cargando...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Text>recetas</Text>
        <FlatList
          data={recetas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ItemReceta
            title={item.nombre}
            imageUrl={item.screenshot}
            descripcion='Tipo Receta'
          />}
          style={styles.lista}
        />
      </SafeAreaView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  lista: {
    marginTop: 5,
    width: '100%',
    height: 600,
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: '#f9c2ff',
    height: 150,
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 120,
    paddingHorizontal: 30,
    margin: 20,
    borderRadius: 15,
    elevation: 3,
    backgroundColor: '#c56d',
  },
  text: {
    fontSize: 20,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
  filtrar: {
    flexDirection: 'row',
    color: Colors.primary,
    justifyContent: 'center',
  },
  search: {
    color: Colors.primary,
    marginRight: 30,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    paddingRight: 20,
  },
  searchInput: {
    height: 40,
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    paddingHorizontal: 10,
  },
  headerTitleStyle: {
    fontFamily: 'Sanches-Regular',
    fontSize: 18,
    color: Colors.primary,
  },
});
