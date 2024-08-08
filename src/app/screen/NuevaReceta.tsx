import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, SafeAreaView, Button, Image, TouchableOpacity, ScrollView, Alert, View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from "../styles/color";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator'; 
import { Ingrediente, Receta, createDefaultReceta } from "../types";
import globalStyles from "../styles/styles";
import IngredientModal from "../modal/modalNewIng";
import { ImputTipoReceta } from "../componentes/imputTipoReceta";
import { operReceta } from "../../databse/operRecetaDB";
import { operIngrediente } from "../../databse/operIngrediente";



export default function NuevaReceta() {
    const [receta, setReceta] = useState<Receta | null>(createDefaultReceta());
    const [listIngredientes, setListIngredientes] = useState<Ingrediente[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    const { createReceta } = operReceta();
    const { createIngrediente } = operIngrediente();

    const handleGuardar = async () => {
        try {
            if (receta != null) {
                const recetaResult = await createReceta(receta);
                setReceta(createDefaultReceta());
                Alert.alert('Listo', 'Receta guardada exitosamente');
                console.log('se guardaron los ingredientes', recetaResult.ingredientes);

            }

        } catch (error) {
            console.error('Error al insertar receta:', error);
            Alert.alert('Error', 'No se pudo guardar la receta');
        }
    };

    const guardarRecetaComun = () => {
        if (!receta?.nombre || !receta.procedimiento || !receta.ingredientes) {
            Alert.alert('Error', 'Por favor, rellena todos los campos');
            return;
        }
        handleGuardar();
    };

    const guardarRecetaSimple = () => {
        if (!receta?.nombre || !receta.screenshot || !receta.tipoRecetaId) {
            Alert.alert('Error', 'Por favor, rellena todos los campos');
            return;
        }
        handleGuardar();
    };

    const handleAddIngredient = (ingredient: Ingrediente) => {
        setReceta((prevReceta) => {
            if (!prevReceta) return null;
            return { ...prevReceta, ingredientes: [...prevReceta.ingredientes, ingredient] };
        })
    };

    const handleTipReceta = (item: number) => {
        setReceta((prevReceta) => {
            if (!prevReceta) return null;
            return { ...prevReceta, tipoRecetaId: item };
        });
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Lo siento, necesitamos permisos para acceder a la galería de imágenes.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;

            try {
                const manipulatedImage = await ImageManipulator.manipulateAsync(
                    uri,
                    [],
                    { compress: 1, format: ImageManipulator.SaveFormat.PNG }
                );

                // Convierte la imagen redimensionada a Uint8Array
                const response = await fetch(manipulatedImage.uri);
                const blob = await response.blob();
                const reader = new FileReader();
                const promise = new Promise<Uint8Array>((resolve, reject) => {
                    reader.onloadend = () => {
                        if (reader.result instanceof ArrayBuffer) {
                            resolve(new Uint8Array(reader.result));
                        } else {
                            reject(new Error('Failed to read ArrayBuffer'));
                        }
                    };
                    reader.onerror = reject;
                });
                reader.readAsArrayBuffer(blob);
                const uint8Array = await promise;

                setReceta((prevReceta) => {
                    if (!prevReceta) return null;
                    return { ...prevReceta, screenshot: uint8Array };
                });
            } catch (error) {
                console.error('Error al redimensionar la imagen:', error);
            }
        }
    };

    const screenIcono = (uint8Array: Uint8Array): string => {
        let binary = '';
        const bytes = new Uint8Array(uint8Array);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return `data:image/jpeg;base64,${btoa(binary)}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView keyboardShouldPersistTaps="handled">
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.recetaTipoboton, receta?.recetaSimple === 1 && styles.activeButton]}
                        onPress={() => setReceta({
                            id: -1, nombre: "", imagen: null,
                            procedimiento: "",
                            tipoRecetaId: 1,
                            screenshot: null,
                            recetaSimple: 0,
                            ingredientes: []
                        })}
                    >
                        <Text style={[styles.botonText, receta?.recetaSimple === 1 && styles.botonTextActivo]}>Receta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.recetaTipoboton, receta?.recetaSimple === 0 && styles.activeButton]}
                        onPress={() => setReceta({
                            id: -1, nombre: "", imagen: null,
                            procedimiento: "",
                            tipoRecetaId: 1,
                            screenshot: null,
                            recetaSimple: 1,
                            ingredientes: []
                        })}
                    >
                        <Text style={[styles.botonText, receta?.recetaSimple === 0 && styles.botonTextActivo]}>Screenshot</Text>
                    </TouchableOpacity>
                </View>
                {receta?.recetaSimple === 0 &&
                    <SafeAreaView style={styles.fullScreenContainer}>
                        <Text style={styles.tituloText}>Receta Comun</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(e) => setReceta((prevReceta) => {
                                if (!prevReceta) return null;
                                return { ...prevReceta, nombre: e }
                            })}
                            value={receta.nombre}
                            placeholder="Nombre de la receta"
                            placeholderTextColor={Colors.text}
                        />
                        <TextInput
                            style={styles.inputProcedimiento}
                            onChangeText={(e) => setReceta((prevReceta) => {
                                if (!prevReceta) return null;
                                return { ...prevReceta, procedimiento: e };
                            })}
                            value={receta.procedimiento}
                            placeholder="Procedimiento:"
                            placeholderTextColor={Colors.text}
                            multiline={true}
                        />
                        <Button
                            title="Agregar Ingrediente"
                            onPress={() => setModalVisible(true)}
                            color={Colors.primary}
                        />
                        <View style={styles.listIng}>
                            {receta.ingredientes.map((ingrediente, index) => (
                                <Text key={index}>{[ingrediente.nombre, '- ', ingrediente.cantidad, ' ', ingrediente.unidadMedidaId]}</Text>
                            ))}
                        </View>
                        <ImputTipoReceta
                            placeholder="Tipo Receta"
                            onSelect={handleTipReceta}
                        />
                        <Button
                            title="Guardar"
                            onPress={guardarRecetaComun}
                            color={Colors.primary}
                        />
                    </SafeAreaView>}
                {receta?.recetaSimple === 1 &&
                    <SafeAreaView style={styles.fullScreenContainer}>
                        <Text style={styles.tituloText}>Receta Rapida</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(e) => setReceta((prevReceta) => {
                                if (!prevReceta) return null;
                                return { ...prevReceta, nombre: e }
                            })}
                            value={receta.nombre}
                            placeholder="Nombre de la receta"
                            placeholderTextColor={Colors.text}
                        />
                        <Text style={[globalStyles.textDescrip, styles.textdesc]}>Screenshot</Text>
                        <TouchableOpacity
                            onPress={pickImage} style={styles.imageAdd}>
                            {receta.screenshot ? (
                                <Image source={{ uri: screenIcono(receta.screenshot) }} style={styles.imageScreen} resizeMode="cover" />
                            ) : (
                                <FontAwesome5 name="image" size={60} color={Colors.primary} />
                            )}
                        </TouchableOpacity>
                        <ImputTipoReceta
                            placeholder="Tipo Receta"
                            onSelect={handleTipReceta}
                        />
                        <Button
                            title="Guardar"
                            onPress={guardarRecetaSimple}
                            color={Colors.primary}
                        />
                    </SafeAreaView>}
            </ScrollView>
            <IngredientModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleAddIngredient}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    listIng: {
        alignItems: 'center',
        margin: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.primary,
        width: '70%',
    },
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    recetaTipoboton: {
        width: '50%',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: Colors.primary,
        marginTop: -10,
    },
    activeButton: {
        backgroundColor: Colors.primary,
        tintColor: '#ccc',
    },
    botonText: {
        fontSize: 20,
        fontFamily: 'Sanches-Regular',
        color: Colors.primary,
    },
    botonTextActivo: {
        fontSize: 20,
        fontFamily: 'Sanches-Regular',
        color: 'white',
    },
    fullScreenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tituloText: {
        fontFamily: 'Sanches-Regular',
        fontSize: 20,
        textAlign: 'center',
        color: Colors.primary,
        margin: 10,
    },
    textdesc: {
        margin: 20,
        marginBottom: -18,
    },
    imageAdd: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    imageScreen: {
        width: 100,
        height: 100,
        marginTop: 8,
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    input: {
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: Colors.primary,
        marginVertical: 10,
        paddingHorizontal: 10,
        width: '80%',
    },
    inputProcedimiento: {
        height: 140,
        textAlign: 'auto',
        textAlignVertical: 'top',
        borderColor: Colors.primary,
        borderWidth: 1,
        marginVertical: 10,
        paddingHorizontal: 10,
        width: '100%',
    },
});
