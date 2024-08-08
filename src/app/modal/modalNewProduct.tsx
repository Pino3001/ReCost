import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, TextInput, Button, Alert } from "react-native";
import { Product, createDefaultProducto } from "../types";
import { TextImputUnidadMedida } from "../componentes/imputUmedida";
import { FontAwesome5 } from "@expo/vector-icons";
import globalStyles from "../styles/styles";
import Colors from "../styles/color";
import { operProductos } from "../../databse/operProductoDB";

interface ProductoModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (data: Product, tipoMed: string) => void;
    nombreProd: string;
}

export default function ProductoModal({ visible, onClose, onSave, nombreProd }: ProductoModalProps) {
    const [producto, setProducto] = useState<Product>(createDefaultProducto());
    const [tipoMed, setTipoMed] = useState('');

    const { createProducto } = operProductos();

    useEffect(() => {
        setProducto((prevProducto) => ({
            ...prevProducto,
            nombre: nombreProd
        }));
    }, [nombreProd]);

    const handleSave = async () => {
        console.log('falta: ', producto.nombre, producto.unidadMedidaID,producto.precio, producto.cantidadXcompra)
        if (!producto.cantidadXcompra || !producto.unidadMedidaID || !producto.precio || !producto.nombre) {
            Alert.alert('Error', 'Por favor, rellena todos los campos');
            return;
        }
        try {
            await createProducto(producto);
            onSave(producto, tipoMed);
            onClose();
        } catch (error) {
            console.error('Error al insertar producto:', error);
            Alert.alert('Error', 'No se pudo guardar el producto');
        }
    };

    const handleUmedida = (item: number, item2: string) => {
        setProducto((prevProduct) => {
            return { ...prevProduct, unidadMedidaID: item }
        });
        setTipoMed(item2);
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
                            onChangeText={(e) => {
                                const numericValue = parseInt(e, 10);
                                setProducto((prevProduct) => ({
                                    ...prevProduct,
                                    cantidadXcompra: isNaN(numericValue) ? 0 : numericValue,
                                }));
                            }}
                            value={producto.cantidadXcompra === 0 ? '' : producto.cantidadXcompra.toString()}
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
                        onChangeText={(e) => {
                            const numericValue = parseInt(e, 10);
                            setProducto((prevProducto) => ({
                                ...prevProducto,
                                precio: isNaN(numericValue) ? 0 : numericValue,
                            }))
                        }}
                        value={producto.precio === 0 ? '' : producto.precio.toString()}
                        placeholder="Costo $"
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={globalStyles.inputModal}
                        onChangeText={(e) => {
                            setProducto((prevProducto) => ({
                                ...prevProducto,
                                proveedor: e,
                            }))
                        }}
                        value={producto.proveedor}
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
