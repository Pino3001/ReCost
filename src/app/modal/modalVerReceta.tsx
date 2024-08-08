import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, View, Button, FlatList } from "react-native";
import { Receta } from "../types";
import { operUnidadMedida } from "../../databse/operUnidadMedDB";

interface VerRecetaProps {
    visible: boolean;
    onClose: () => void;
    receta: Receta | null;
}

const VerReceta: React.FC<VerRecetaProps> = ({ visible, onClose, receta }) => {
    const { selectByID } = operUnidadMedida();
    const [tipoMedMap, setTipoMedMap] = useState<Record<number, string>>({});

    useEffect(() => {
        const fetchTipoMed = async () => {
            if (receta?.ingredientes) {
                const tipoMedPromises = receta.ingredientes.map(async (item) => {
                    const result = await selectByID(item.unidadMedidaId);
                    return { id: item.unidadMedidaId, tipoMed: result?.tipoMed || 'Desconocido' };
                });

                const tipoMedResults = await Promise.all(tipoMedPromises);
                const tipoMedMap = tipoMedResults.reduce((map, { id, tipoMed }) => {
                    map[id] = tipoMed;
                    return map;
                }, {} as Record<number, string>);
                setTipoMedMap(tipoMedMap);
            }
        };

        fetchTipoMed();
    }, [receta]);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>{receta?.nombre}</Text>
                    <FlatList
                        data={receta?.ingredientes}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View>
                                <Text>{item.nombre}</Text>
                                <Text>{item.cantidad}</Text>
                                <Text>{tipoMedMap[item.unidadMedidaId] || 'Desconocido'}</Text>
                            </View>
                        )}
                    />
                    <Button title="Cerrar" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
}

export default VerReceta;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        height: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
    },
});
