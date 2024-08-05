import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface ItemProps {
    title: string;
    imageUrl: Uint8Array | null;
    descripcion: string;
}

const screenIcono = (uint8Array: Uint8Array): string => {
    let binary = '';
    const bytes = new Uint8Array(uint8Array);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return `data:image/jpeg;base64,${btoa(binary)}`;
};

// Declaración del componente funcional con tipado
export const ItemReceta: React.FC<ItemProps> = ({ title, imageUrl, descripcion }) => {
    const imageSource = imageUrl
    ? { uri: screenIcono(imageUrl) }
    : require('/home/alexis/Documentos/ReCost.app/assets/screenshot.png');
    return (
        <View style={styles.itemContainer}>
            <Image source={imageSource} style={styles.itemImage} />
            <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{title}</Text>
                <Text style={styles.descripcion}>{descripcion}</Text>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    itemContainer: {
        width:'95%',
        alignSelf: 'center',
        flexDirection: 'row',
        marginVertical: 8,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    descripcion: {
        fontSize: 14,
        color: '#666',
    },
});

