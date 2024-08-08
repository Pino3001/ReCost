import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, View, Image, Button } from "react-native";

interface VerScreenshotProps {
    visible: boolean;
    onClose: () => void;
    screenshot: Uint8Array | null;
    nombreReceta: string;
}

const VerScreenshot: React.FC<VerScreenshotProps> = ({ visible, onClose, screenshot, nombreReceta }) => {
    const [imageUri, setImageUri] = useState<string | null>(null);

    useEffect(() => {
        if (screenshot) {
            const base64String = btoa(String.fromCharCode(...screenshot));
            setImageUri(`data:image/png;base64,${base64String}`)
        } else {
            setImageUri(null);
        }
    }, [screenshot]);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>{nombreReceta}</Text>
                    {imageUri && (
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    )}
                    <Button title="Cerrar" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

export default VerScreenshot;

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
    image: {
        width: '100%',
        height: '90%',
    },
});
