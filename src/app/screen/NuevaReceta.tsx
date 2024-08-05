import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, SafeAreaView, Button, Image, TouchableOpacity, ScrollView, Alert, View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from "../styles/color";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator'; // Importa ImageManipulator
import globalStyles from "../styles/styles";
import IngredientModal from "../modal/modalNewIng";
import { ImputTipoReceta } from "../componentes/imputTipoReceta";
import { operReceta } from "../../databse/operRecetaDB";
import { operRelaciones } from "../../databse/operRelacionesDB";
import { operIngrediente } from "../../databse/operIngrediente";

type IngredienteDatabase = {
    nombre: string,
    cantidad: number,
    unidadMedidaId: number,
    tipoUnidad: string,
    productoId: number,
};

export default function NuevaReceta() {
    const [nombreReceta, setNombreReceta] = useState('');
    const [imagen, setImagen] = useState<Uint8Array | null>(null);
    const [procedimiento, setProcedimiento] = useState('');
    const [recetScreenshot, setRecetScreenshot] = useState<Uint8Array | null>(null);
    const [tipoRecetaId, setTipoRecetaId] = useState('');
    const [ingredientes, setIngredientes] = useState<IngredienteDatabase[]>([]);
    const [recetaSimple, setRecetaSimple] = useState(0);
    const [listIngredientes, setListIngredientes] = useState<number[]>([]);
    const [activeScreen, setActiveScreen] = useState('receta');
    const [modalVisible, setModalVisible] = useState(false);

    const { createReceta } = operReceta();
    const { createRelacionRI } = operRelaciones();
    const { createIngrediente } = operIngrediente();

    const handleGuardar = async () => {
        try {
            await Promise.all(
                ingredientes.map(async (ingrediente) => {
                    const IngredienteData = {
                        nombre: ingrediente.nombre,
                        cantidad: ingrediente.cantidad,
                        unidadMedidaId: ingrediente.unidadMedidaId,
                        productoId: ingrediente.productoId,
                    };
                    const ingredienteResult = await createIngrediente(IngredienteData);
                    setListIngredientes(prevIngredientes => [...prevIngredientes, ingredienteResult.idFilaIncertada]);
                })
            );

            const RecetaDatabase = {
                nombre: nombreReceta,
                imagen: imagen,
                procedimiento: procedimiento,
                screenshot: recetScreenshot,
                tipoRecetaId: parseInt(tipoRecetaId, 10),
                recetaSimple: recetaSimple,
            };

            const recetaResult = await createReceta(RecetaDatabase);

            await Promise.all(
                listIngredientes.map(async (ingredienteId) => {
                    await createRelacionRI({ recetaId: recetaResult.idFilaIncertada, ingredienteId });
                })
            );

            setNombreReceta('');
            setImagen(null);
            setProcedimiento('');
            setRecetScreenshot(null);
            setTipoRecetaId('');
            setIngredientes([]);
            Alert.alert('Listo', 'Receta guardada exitosamente');
        } catch (error) {
            console.error('Error al insertar receta:', error);
            Alert.alert('Error', 'No se pudo guardar la receta');
        }
    };

    const guardarRecetaComun = () => {
        if (!nombreReceta || !procedimiento || !ingredientes) {
            Alert.alert('Error', 'Por favor, rellena todos los campos');
            return;
        }
        setRecetaSimple(2);
        handleGuardar();
    };

    const guardarRecetaSimple = () => {
        console.log('hay', tipoRecetaId);
        if (!nombreReceta || !recetScreenshot || !tipoRecetaId) {
            Alert.alert('Error', 'Por favor, rellena todos los campos');
            return;
        }
        setRecetaSimple(1);
        handleGuardar();
    };

    const handleAddIngredient = (ingredient: { nombre: string; cantidad: number; unidadMedidaId: number; tipoUnidad: string; productoId: number; }) => {
        setIngredientes((prev) => [...prev, ingredient]);
    };

    const pickImage = async (setRecetScreenshot: React.Dispatch<React.SetStateAction<Uint8Array | null>>) => {
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
                    [{ resize: { width: 100, height: 100 } }],
                    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
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
                setRecetScreenshot(uint8Array);
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



    const handleTipReceta = (item: string) => {
        console.log('Selected:', item);
        setTipoRecetaId(item);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView keyboardShouldPersistTaps="handled">
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.recetaTipoboton, activeScreen === 'receta' && styles.activeButton]}
                        onPress={() => setActiveScreen('receta')}
                    >
                        <Text style={[styles.botonText, activeScreen === 'receta' && styles.botonTextActivo]}>Receta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.recetaTipoboton, activeScreen === 'screenshot' && styles.activeButton]}
                        onPress={() => setActiveScreen('screenshot')}
                    >
                        <Text style={[styles.botonText, activeScreen === 'screenshot' && styles.botonTextActivo]}>Screenshot</Text>
                    </TouchableOpacity>
                </View>
                {activeScreen === 'receta' &&
                    <SafeAreaView style={styles.fullScreenContainer}>
                        <Text style={styles.tituloText}>Receta Comun</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setNombreReceta}
                            value={nombreReceta}
                            placeholder="Nombre de la receta"
                            placeholderTextColor={Colors.text}
                        />
                        <TextInput
                            style={styles.inputProcedimiento}
                            onChangeText={setProcedimiento}
                            value={procedimiento}
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
                            {ingredientes.map((ingrediente, index) => (
                                <Text key={index}>{[ingrediente.nombre, '- ', ingrediente.cantidad, ' ', ingrediente.tipoUnidad]}</Text>
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
                {activeScreen === 'screenshot' &&
                    <SafeAreaView style={styles.fullScreenContainer}>
                        <Text style={styles.tituloText}>Receta Rapida</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setNombreReceta}
                            value={nombreReceta}
                            placeholder="Nombre de la receta"
                            placeholderTextColor={Colors.text}
                        />
                        <Text style={[globalStyles.textDescrip, styles.textdesc]}>Screenshot</Text>
                        <TouchableOpacity onPress={() => pickImage(setRecetScreenshot)} style={styles.imageAdd}>
                            {recetScreenshot ? (
                                <Image source={{ uri: screenIcono(recetScreenshot) }} style={styles.imageScreen} resizeMode="cover" />
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
