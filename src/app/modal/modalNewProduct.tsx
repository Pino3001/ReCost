import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, TextInput, Button, Alert } from "react-native";
import { TextImputUnidadMedida } from "../componentes/imputUmedida";
import { FontAwesome5 } from "@expo/vector-icons";
import globalStyles from "../styles/styles";
import Colors from "../styles/color";
import { operProductos } from "../../databse/operProductoDB";

interface ProductoModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (id: number) => void;
    nombreProd: string;
}

export default function ProductoModal({ visible, onClose, onSave, nombreProd }: ProductoModalProps) {
    const [cantidadProducto, setCantidadProducto] = useState('');
    const [costoProducto, setCostoProducto] = useState('');
    const [unidMedida, setUnidadMedida] = useState('');
    const [proveedor, setProveedor] = useState('');

    const { createProducto } = operProductos();

    const handleSave = async () => {
        if (!cantidadProducto || !unidMedida || !costoProducto) {
            Alert.alert('Error', 'Por favor, rellena todos los campos');
            return;
        }
        try {
            const ProductDatabase = {
                nombre: nombreProd,
                precio: parseFloat(costoProducto),
                cantidadXcompra: parseFloat(cantidadProducto),
                unidadMedida: parseInt(unidMedida, 10),
                proveedor: proveedor
            }
            const productoResult = await createProducto(ProductDatabase);
            onSave(productoResult.idFilaIncertada);
            onClose();
        } catch (error) {
            console.error('Error al insertar producto:', error);
            Alert.alert('Error', 'No se pudo guardar el producto');
        }
    };
    const handleUmedida = (item: string) => {
        setUnidadMedida(item);
    };
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}>
            <View style={globalStyles.centeredView}>
                <View style={globalStyles.modalView}>
                    <TouchableOpacity onPress={onClose} style={styles.botonClose}>
                        <FontAwesome5 name="times" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                    <Text style={globalStyles.modalText}>Agregar Producto</Text>
                    <Text style={globalStyles.modalText}>{nombreProd}</Text>
                    <View style={globalStyles.row}>
                        <TextInput
                            style={[globalStyles.inputModal, globalStyles.halfWidth]}
                            onChangeText={setCantidadProducto}
                            value={cantidadProducto}
                            placeholder="Cantidad"
                            keyboardType="numeric"
                        />
                        <TextImputUnidadMedida
                            placeholder="Un. Medida"
                            onSelect={handleUmedida}
                        />
                    </View>
                    <TextInput
                        style={[globalStyles.inputModal, globalStyles.halfWidth]}
                        onChangeText={setCostoProducto}
                        value={costoProducto}
                        placeholder="Costo $"
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={globalStyles.inputModal}
                        onChangeText={setProveedor}
                        value={proveedor}
                        placeholder="Proveedor"
                    />
                    <Button
                        color={Colors.primary}
                        title="Guardar"
                        onPress={handleSave}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    botonClose: {
        alignSelf: 'flex-end',
        marginBottom: -30,
    }
});
