/* import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, FlatList, View, Modal } from 'react-native';
import { operReceta, RecetaDatabase } from "../../databse/operRecetaDB";
import Colors from "../styles/color";

interface TipoReceta {
    id: number;
    tipo: string;
}
interface DropdownProps {
    placeholder: string;
    onSelect: (item: string) => void;
}

export const ImputTipoReceta: React.FC<DropdownProps> = ({ placeholder, onSelect }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [recetas, setRecetas] = useState<RecetaDatabase[]>([]);

    const { showRecetas } = operReceta();

    useEffect(() => {
        const fetchReceta = async () => {
            try {
                const result = await showRecetas();
                setRecetas(result);
            } catch (error) {
                console.error('Error al obtener productos:', error);
            }
        };
        fetchReceta();
    }, []);

    const handleSelect = (item: TipoReceta) => {
        setSelectedValue(item.tipo);
        onSelect(item.id.toString());
        setModalVisible(false);
    };
    const handleClose = () => {
        setModalVisible(false);
    };
    const handleOutsidePress = () => {
        if (modalVisible) {
            handleClose();
        }
    };
    const getTextStyle = (selectedValue: string) => {
        if (selectedValue === 'Cocina') {
            return styles.textCocina;
        } else if (selectedValue === 'Pasteleria-Panaderia') {
            return styles.text;
        } else {
            return styles.placeholder;
        }
    };
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.input}
                onPress={() => setModalVisible(true)}
            >
                <Text style={getTextStyle(selectedValue)}>
                    {selectedValue || placeholder}
                </Text>
                <FontAwesome name="caret-down" size={24} color={Colors.primary} style={styles.icon} />
            </TouchableOpacity>

            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={handleOutsidePress}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <FlatList
                                data={tReceta}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => handleSelect(item)} style={styles.item}>
                                        <Text style={styles.itemText}>{item.tipo}</Text>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item) => item.id.toString()}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '75%',
        alignSelf: 'center',
        padding: 10,
    },
    input: {
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: Colors.primary,
        alignItems: 'center',
        marginVertical: 10,
        paddingHorizontal: 10,
        width: '90%',
        paddingLeft: 10,
    },
    text: {
        fontSize: 12,
        alignSelf: 'flex-start',
    },
    textCocina: {
        fontSize: 16,
    },
    placeholder: {
        fontSize: 16,
        color: Colors.text,
    },
    icon: {
        marginLeft: 130,
        alignSelf: 'center',
        justifyContent: 'center',
        margin: -22,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 4,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    item: {
        paddingVertical: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    itemText: {
        fontSize: 16,
    },
});

 */