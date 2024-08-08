import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, FlatList, View, TextInput, Button, Alert } from "react-native";
import ProductoModal from "./modalNewProduct";
import { FontAwesome5 } from "@expo/vector-icons";
import globalStyles from "../styles/styles";
import Colors from "../styles/color";
import { Ingrediente, createDefaultIngrediente, Product, createDefaultProducto } from "../types";
import { operProductos } from "../../databse/operProductoDB";
import { TextImputUnidadMedida } from "../componentes/imputUmedida";


interface IngredientModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (ing: Ingrediente) => void;
}
export default function IngredientModal({ visible, onClose, onSave }: IngredientModalProps) {
  const [ing, setIng] = useState<Ingrediente>(createDefaultIngrediente());

  const [text, setText] = useState<string>('');
  const [tipoMed, setTipoMed] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showAddButton, setShowAddButton] = useState<boolean>(false);
  const [productosLista, setProductosLista] = useState<Product[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { showProductos } = operProductos();

  useEffect(() => {
    //obtiene la lista de productos
    const fetchProductos = async () => {
      try {
        const result = await showProductos();
        setProductosLista(result);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };
    fetchProductos();
  }, []);

  const filterSuggestions = (query: string) => {
    //filtra la busqued por el prop pasado
    if (query === '') {
      setSuggestions([]);
      setShowAddButton(false);
      return;
    }
    const filtered = productosLista.filter(producto =>
      producto.nombre.toLowerCase().includes(query.toLowerCase())
    );
    //Compruebo que el balor sea exacto, si no lo es muestra el boton de agregar
    const exactMatch = filtered.some(producto => producto.nombre.toLowerCase() === query.toLowerCase());
    setSuggestions(filtered);
    setShowAddButton(!exactMatch && query.length > 0);
  };

  const handleChange = (input: string) => {
    // hubo un cambio en el imput
    setText(input);
    filterSuggestions(input);
    setIng((prevIng) => {
      return { ...prevIng, nombre: input }
    })
  };

  const handleSelect = (item: string) => {
    //selecciono un item de la lista
    setText(item);
    setIng((prevIng) => {
      return { ...prevIng, nombre: item }
    })
    setSuggestions([]);
    setShowAddButton(false);
  };

  const handleAdd = () => {
    console.log(`Agregar nuevo item: ${text}`);
    setText('');
    setSuggestions([]);
    setShowAddButton(false);
  };

  const agregarProducto = (data: Product ) => {
    handleSelect(text);
    setTipoMed(data.nombre);
    setIng({
      ...ing,
      productoId: data.id,
    })
  };


  const handleUmedida = (item: number, item2: string) => {
    setIng((prevIng) => ({
      ...prevIng,
      unidadMedidaId: item,
    }));

  };

  const limpiarEstados = () => {
    setIng(createDefaultIngrediente());
    setText('');
    setShowAddButton(false);
  };

  const cerrarModal = () => {
    limpiarEstados();
    onClose();
  };


  const handleSave = async () => {
    if (!ing?.nombre || !ing.cantidad || !ing.unidadMedidaId) {
      Alert.alert('Error', 'Por favor, rellena todos los campos');
      return;
    }
    try {
      onSave(ing);
      limpiarEstados();
      onClose();
    } catch (error) {
      console.error('Error al insertar ingrediente:', error);
      Alert.alert('Error', 'No se pudo guardar el ingrediente');
    }
  };

  const renderItem = ({ item }: { item: Product | { id: string; nombre: string; } }) => (
    item.id === 'addButton' ? (
      <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
        <Text onPress={() => setModalVisible(true)} style={styles.addButtonText}>{item.nombre}</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity onPress={() => handleSelect(item.nombre)} style={styles.suggestion}>
        <Text>{item.nombre}</Text>
      </TouchableOpacity>
    )
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={globalStyles.centeredView}>
        <View style={globalStyles.modalView}>
          <TouchableOpacity onPress={cerrarModal} style={styles.botonClose}>
            <FontAwesome5 name="times" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={globalStyles.modalText}>Agregar Ingrediente</Text>
          <TextInput
            style={globalStyles.inputModal}
            onChangeText={handleChange}
            value={ing.nombre}
            placeholder="Nombre del Ingrediente"
          />
          <FlatList
            data={showAddButton ? [...suggestions, { id: 'addButton', nombre: `Agregar "${text}"` }] : suggestions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.suggestionList}
            keyboardShouldPersistTaps="handled"
          />
          <View style={globalStyles.row}>
            <TextInput
              style={[globalStyles.inputModal, globalStyles.halfWidth]}
              keyboardType="numeric"
              onChangeText={(e) => {
                const numericValue = parseInt(e, 10);
                setIng((prevIng) => ({
                  ...prevIng,
                  cantidad: isNaN(numericValue) ? 0 : numericValue,
                }));
              }}
              value={ing.cantidad === 0 ? '' : ing.cantidad.toString()}
              placeholder="Cantidad"
            />

            <TextImputUnidadMedida
              placeholder="Un. Medida"
              onSelect={handleUmedida}
            />
          </View>
          <Button
            title="Guardar"
            color={Colors.primary}
            onPress={handleSave}
          />
          <ProductoModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onSave={agregarProducto}
            nombreProd={text}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  suggestionList: {
    maxHeight: 200,
  },
  suggestion: {
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    zIndex: 1,
  },
  emptyMessage: {
    padding: 10,
    textAlign: 'center',
  },
  addButton: {
    padding: 10,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 10,
    zIndex: 1,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  botonClose: {
    alignSelf: 'flex-end',
    marginBottom: -30,
  },
});
