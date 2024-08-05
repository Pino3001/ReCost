import { useSQLiteContext } from "expo-sqlite"

export type ProductDatabase = {
  id: number
  nombre: string
  precio: number
  cantidadXcompra: number
  unidadMedida: number
  proveedor: string
}

export function operProductos() {
  const database = useSQLiteContext()

  async function createProducto(data: Omit<ProductDatabase, "id">) {
    const statement = await database.prepareAsync(
      "INSERT INTO Producto (nombre, precio, cantidadXcompra, unidadMedida, proveedor) VALUES ($nombre, $precio, $cantidadXcompra, $unidadMedida, $proveedor)"
    )

    try {
      const result = await statement.executeAsync({
        $nombre: data.nombre,
        $precio: data.precio,
        $cantidadXcompra: data.cantidadXcompra,
        $unidadMedida: data.unidadMedida,
        $proveedor: data.proveedor
      })

      const idFilaIncertada = result.lastInsertRowId
      console.log('si ingreso el producto ' + data.nombre)
      return { idFilaIncertada }
    } catch (error) {
      throw error
    } finally {
      await statement.finalizeAsync()
    }
  }

  async function selectByNombre(nombre: string) {
    try {
      const query = "SELECT * FROM Producto WHERE nombre LIKE ?"

      const response = await database.getAllAsync<ProductDatabase>(
        query,
        `%${nombre}%`
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async function updateProducto(data: ProductDatabase) {
    const statement = await database.prepareAsync(
      "UPDATE Producto SET nombre = $nombre, precio = $precio, cantidadXCompra = $cantidadXCompra, unidadMedida = $unidadMedida, proveedor = $proveedor WHERE id = $id"
    )

    try {
      await statement.executeAsync({
        $id: data.id,
        $nombre: data.nombre,
        $precio: data.precio,
        $cantidadXCompra: data.cantidadXcompra,
        $unidadMedida: data.unidadMedida,
        $proveedor: data.proveedor
      })
    } catch (error) {
      throw error
    } finally {
      await statement.finalizeAsync()
    }
  }

  async function removeProducto(id: number) {
    try {
      await database.execAsync("DELETE FROM Producto WHERE id = " + id)
    } catch (error) {
      throw error
    }
  }

  async function showProductos(): Promise<ProductDatabase[]> {
    try {
      const query = "SELECT * FROM Producto"

      const response = await database.getAllAsync<ProductDatabase>(query)

      return response
    } catch (error) {
      throw error
    }
  }

  async function listProdID(): Promise<{ id: number; nombre: string }[]> {
    try {
      const query = "SELECT id, nombre FROM Producto"; // Selecciona solo los campos necesarios
  
      // Ejecuta la consulta
      const response = await database.getAllAsync<ProductDatabase>(query);
  
      // Mapea la respuesta para devolver solo los campos id y nombre
      const productos = response.map(producto => ({
        id: producto.id,
        nombre: producto.nombre
      }));
  
      return productos;
    } catch (error) {
      throw error;
    }
  }

  return { createProducto, selectByNombre, updateProducto, removeProducto, showProductos, listProdID }
}