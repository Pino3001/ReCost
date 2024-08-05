import React, { useState } from "react";
import { StyleSheet, TextInput, SafeAreaView, Button, ScrollView, Alert } from "react-native";
import { operProductos } from "../../databse/operProductoDB";
import { operUnidadMedida } from "../../databse/operUnidadMedDB";

export default function NuevoProducto() {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('');
  const { createProducto } = operProductos();
  const { createUnidadMedida } = operUnidadMedida();

  const handleGuardar = async () => {
    if (!nombre || !precio || !cantidad || !unidadMedida) {
      Alert.alert('Error', 'Por favor, rellena todos los campos');
      return;
    }

    try {

      const unidadMedidaData = {
        tipoMed: unidadMedida
      }

      const uMedResult = await createUnidadMedida(unidadMedidaData);
      console.log('Producto insertado:', uMedResult);
      Alert.alert('Listo', 'Producto guardado exitosamente');

      const productoData = {
        nombre,
        precio: parseFloat(precio),
        cantidadXcompra: parseFloat(cantidad),
        unidadMedida: uMedResult.idFilaIncertada,
        proveedor,
      }
      const productResult = await createProducto(productoData);
      console.log('Producto insertado:', productResult);
      Alert.alert('Listo', 'Producto guardado exitosamente');

      setNombre('');
      setPrecio('');
      setCantidad('');
      setUnidadMedida('');
      setProveedor('');
    } catch (error) {
      console.error('Error al insertar producto:', error);
      Alert.alert('Error', 'No se pudo guardar el producto');
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <TextInput 
          style={styles.input} 
          onChangeText={setNombre} 
          value={nombre} 
          placeholder="Nombre del producto"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPrecio}
          value={precio}
          placeholder="Precio"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          onChangeText={setCantidad}
          value={cantidad}
          placeholder="Cantidad"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          onChangeText={setUnidadMedida}
          value={unidadMedida}
          placeholder="Unidad de Medida"
        />
        <TextInput
          style={styles.input}
          onChangeText={setProveedor}
          value={proveedor}
          placeholder="Proveedor"
        />
        <Button
          title="Guardar"
          color="#841584"
          onPress={handleGuardar}
          accessibilityLabel="Guardar producto"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
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
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
});
