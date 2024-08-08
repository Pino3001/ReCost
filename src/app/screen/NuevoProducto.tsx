import React, { useState } from "react";
import { StyleSheet, TextInput, SafeAreaView, Text, TouchableOpacity, Alert } from "react-native";
import globalStyles from "../styles/styles";
import Colors from "../styles/color";
import { operProductos } from "../../databse/operProductoDB";
import { operUnidadMedida } from "../../databse/operUnidadMedDB";
import { TextImputUnidadMedida } from "../componentes/imputUmedida";

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

  const handleUmedida = (item: string) => {
    setUnidadMedida(item);
};

  return (
    <SafeAreaView style={styles.viewProducto}>
                          <TextInput
                        style={globalStyles.inputModal}
                        onChangeText={setNombre}
                        value={nombre}
                        placeholder="Nombre del Producto"
                    />
                          <SafeAreaView style={globalStyles.row}>
                        <TextInput
                            style={[globalStyles.inputModal, globalStyles.halfWidth]}
                            onChangeText={setCantidad}
                            value={cantidad}
                            placeholder="Cantidad"
                            keyboardType="numeric"
                        />
                        <TextImputUnidadMedida
                            placeholder="Un. Medida"
                            onSelect={handleUmedida}
                        />
                    </SafeAreaView>
      <TextInput
                        style={[globalStyles.inputModal, globalStyles.halfWidth]}
                        onChangeText={setPrecio}
                        value={precio}
                        placeholder="Costo $"
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={globalStyles.inputModal}
                        onChangeText={setProveedor}
                        value={proveedor}
                        placeholder="Proveedor"
                    />
        <TouchableOpacity
          style={styles.botonGuardar}
                  onPress={handleGuardar}
                  >
          <Text style={styles.text}>Guardar</Text>
        </TouchableOpacity>
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
  viewProducto: {
    marginTop: 30,
    flex: 1,
    alignItems: "center",
    alignSelf: 'center',
    width: '80%',
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
  botonGuardar: {
    alignItems: "center",
    justifyContent: "center",
    width: 180,
    height: 40,
    margin: 20,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  text: {
    fontSize: 20,
    fontFamily: "Sanches-Regular",
    lineHeight: 21,
    color: "black",
  },
});
