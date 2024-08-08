import 'react-native-gesture-handler';
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Receta, createDefaultReceta, Ingrediente } from '../types';
import VerScreenshot from '../modal/modalVerScreenshot';
import VerReceta from '../modal/modalVerReceta';
import { useNavigation } from '@react-navigation/native';
import { operReceta } from '../../databse/operRecetaDB';
import { operIngrediente } from '../../databse/operIngrediente';
import { operUnidadMedida } from '../../databse/operUnidadMedDB';
import { FlatList } from 'react-native-gesture-handler';
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from '../styles/color';
import { ItemReceta } from '../componentes/ItemReceta';

type IngredienteDatabase = {
  nombre: string,
  cantidad: number,
  unidadMedidaId: number,
  tipoUnidad: string,
  productoId: number,
};

export default function BuscarReceta() {
  const [receta, setReceta] = useState<Receta | null>(createDefaultReceta());
  const [recetaMostrar, setRecetaMostrar] = useState<Receta | null>(createDefaultReceta());


  const [selectedScreenshot, setSelectedScreenshot] = useState<Uint8Array | null>(null);
  const [selectedNombreReceta, setSelectedNombreReceta] = useState('');
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [loading, setLoading] = useState(true);
  const [buscarReceta, setBuscarReceta] = useState(false);
  const [suggestions, setSuggestions] = useState<Receta[]>([]);
  const navigation = useNavigation();

  const { showRecetas } = operReceta();
  const { selectRecetaByID } = operReceta();
  const { selectIngredienteByID } = operIngrediente();
  const { selectByID } = operUnidadMedida();

  const searchInputRef = useRef<TextInput>(null);
  const [modalVisibleScreen, setModalVisibleScreen] = useState(false);
  const [modalVisibleReceta, setModalVisibleReceta] = useState(false);

  // Función para cargar las recetas
  const loadRecetas = async () => {
    try {
      const listaRecetas = await showRecetas();
      setRecetas(listaRecetas);
      setSuggestions(listaRecetas); // Mostrar todas las recetas inicialmente
    } catch (error) {
      console.error('Error al cargar recetas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSuggestions = (query: string) => {
    if (query === '') {
      setSuggestions(recetas);
      return;
    }
    const filtered = recetas.filter(receta =>
      receta.nombre.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const handleChange = (input: string) => {
    filterSuggestions(input);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        buscarReceta ? (
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Buscar receta..."
            onChangeText={handleChange}
            autoFocus={true} // Autofocus cuando el TextInput está visible
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
              onPress={() => {
                setBuscarReceta(!buscarReceta);
                if (!buscarReceta) {
                  setTimeout(() => {
                    if (searchInputRef.current) {
                      searchInputRef.current.focus();
                    }
                  }, 100);
                } else {
                  setSuggestions(recetas);
                }
              }}
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

  useEffect(() => {
    loadRecetas();
  }, []);

  if (loading) {
    return <Text style={styles.loading}>Cargando...</Text>;
  }

  const handleItemPress = async (item: Receta) => {
    if (item.recetaSimple === 1) {
      setSelectedScreenshot(item.screenshot);
      setSelectedNombreReceta(item.nombre);
      setModalVisibleScreen(true);
    }
    else {
      const recetaCompleta = await selectRecetaByID(item.id);
      console.log('Los ingredientes son estos, si tiene: ', recetaCompleta);
      setRecetaMostrar((prevReceta: Receta | null) => {
        if (!prevReceta) return null;
        return { ...prevReceta, procedimiento: item.procedimiento, nombre: item.nombre, imagen: item.imagen, ingredientes: recetaCompleta.ingredientes };
      })
      setModalVisibleReceta(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          // Asignar descripcion basado en item.screen
          console.log('recetaSimple tiene ', item.recetaSimple);
          const descripcion = item.recetaSimple === 0 ? 'Receta Comun' : 'Captura de Receta';
          return (
            <ItemReceta
              title={item.nombre}
              imageUrl={item.screenshot}
              descripcion={descripcion}
              onPress={() => handleItemPress(item)}
            />
          );
        }}
        style={styles.lista}
      />
      <VerScreenshot
        visible={modalVisibleScreen}
        onClose={() => setModalVisibleScreen(false)}
        screenshot={recetaMostrar?.screenshot !== undefined ? recetaMostrar?.screenshot : null}
        nombreReceta={recetaMostrar?.nombre !== undefined ? recetaMostrar?.nombre : ''}
      />
      <VerReceta
        visible={modalVisibleReceta}
        onClose={() => setModalVisibleReceta(false)}
        receta={recetaMostrar}
      />
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
  loading: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
  filtrar: {
    flexDirection: 'row',
    color: Colors.primary,
    justifyContent: 'center',
    marginRight: -20,
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
    marginLeft: -20,
    borderColor: Colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    width: '200%',
    paddingHorizontal: 10,
  },
  headerTitleStyle: {
    fontFamily: 'Sanches-Regular',
    fontSize: 18,
    color: Colors.primary,
  },
});
