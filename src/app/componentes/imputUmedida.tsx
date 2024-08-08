import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, FlatList, View, Modal } from 'react-native';
import { operUnidadMedida } from "../../databse/operUnidadMedDB";
import Colors from "../styles/color";
import { FontAwesome } from '@expo/vector-icons';

interface unidadesDeMedida {
    id: number;
    tipoMed: string;
}
interface DropdownProps {
    placeholder: string;
    onSelect: (item: number, item2: string) => void;
}

   export const TextImputUnidadMedida: React.FC<DropdownProps> = ({ placeholder, onSelect }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [uMedida, setUmedida] = useState<unidadesDeMedida[]>([]);

    const { showUnidadMedida } = operUnidadMedida();
    useEffect(() => {
        // obtiene el map de la tabla prodicto -nombre, id-
        const fetchProductos = async () => {
          try {
            const result = await showUnidadMedida();
        console.log(' entra', result);

            setUmedida(result);
          } catch (error) {
            console.error('Error al obtener productos:', error);
          }
        };
        fetchProductos();
      }, []);

    const handleSelect = (item: unidadesDeMedida) => {
        console.log('Aca entra');
        setSelectedValue(item.tipoMed);
        onSelect(item.id, item.tipoMed);
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
    return (
        <View>
        <TouchableOpacity 
          style={styles.input}
          onPress={() => setModalVisible(true)}
        >
          <Text style={selectedValue ? styles.text : styles.placeholder}>
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
                data={uMedida}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelect(item)} style={styles.item}>
                    <Text style={styles.itemText}>{item.tipoMed}</Text>
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
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        borderWidth: 1,
        paddingHorizontal: 10,
        marginTop: 5,
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 16,
    },
    placeholder: {
        fontSize: 10,
        color: '#888',
    },
    icon: {
        marginLeft: 10,
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

