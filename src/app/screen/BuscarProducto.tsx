import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    VirtualizedList,
    StyleSheet,
    Text,
    FlatList,
    Alert,
    Button,
} from 'react-native';
import { operProductos } from '../../databse/operProductoDB';


interface ProductData {
    id: number;
    nombre: string;
    precio: number;
    cantidadXcompra: number;
    unidadMedida: number;
    proveedor: string;
}

// Define las propiedades del componente Item
interface ItemProps {
    title: string;
}

// Componente para renderizar cada ítem
const Item: React.FC<ItemProps> = ({ title }) => (
    <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
    </View>
);

// Componente principal
export default function BuscarProducto() {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [loading, setLoading] = useState(true);
    const { showProductos } = operProductos()


    // Función para cargar los productos
    const loadProducts = async () => {
        try {
            const productsData = await showProductos();
            console.log('Datos de productos:', productsData); 
            setProducts(productsData);
        } catch (error) {
            console.error('Error al cargar productos:', error);
        } finally {
            setLoading(false);
        }
    };

    // Llama a la función loadProducts al montar el componente
    useEffect(() => {
        loadProducts();
    }, []);

    // Renderiza un mensaje de carga mientras se obtienen los datos
    if (loading) {
        return <Text style={styles.loading}>Cargando...</Text>;
    }

    // Renderiza la lista de productos
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <Item title={item.nombre} />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    item: {
        backgroundColor: '#f9c2ff',
        height: 150,
        justifyContent: 'center',
        marginVertical: 8,
        marginHorizontal: 16,
        padding: 20,
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 120,
        paddingHorizontal: 30,
        margin: 20,
        borderRadius: 15,
        elevation: 3,
        backgroundColor: '#c56d',
    },
    text: {
        fontSize: 20,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'black',
    },
    loading: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
    },
});
