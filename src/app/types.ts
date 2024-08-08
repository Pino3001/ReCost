
export interface Receta {
    id: number;
    nombre: string;
    imagen: Uint8Array | null;
    procedimiento: string;
    tipoRecetaId: number;
    screenshot: Uint8Array | null;
    recetaSimple: number;
    ingredientes: Ingrediente[];
}

export interface Ingrediente {
    id: number;
    idReceta: number;
    nombre: string;
    cantidad: number;
    unidadMedidaId: number;
    productoId: number;
}

export interface Product {
    id: number;
    nombre: string;
    precio: number;
    cantidadXcompra: number;
    unidadMedidaID: number;
    proveedor: string;
};

export const createDefaultReceta = (): Receta => ({
    id: -1, nombre: "",
    imagen: null,
    procedimiento: "",
    tipoRecetaId: 1,
    screenshot: null,
    recetaSimple: 0,
    ingredientes: [],
});

export const createDefaultIngrediente = (): Ingrediente => ({
    id: -1,
    idReceta: -1,
    nombre: "",
    cantidad: 0,
    unidadMedidaId: 0,
    productoId: 0,
});

export const createDefaultProducto = (): Product => ({
    id: -1,
    nombre: '',
    precio: 0,
    cantidadXcompra: 0,
    unidadMedidaID: 0,
    proveedor: '',
});