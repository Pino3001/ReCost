import { useSQLiteContext } from "expo-sqlite"

export type IngredienteDatabase = {
  id: number
  nombre: string
  cantidad: number
  unidadMedidaId: number
  productoId: number
}

export function operIngrediente() {
  const database = useSQLiteContext()

  async function createIngrediente(data: Omit<IngredienteDatabase, "id">) {
    const statement = await database.prepareAsync(
      "INSERT INTO Ingrediente (nombre, cantidad, unidadMedidaId, productoId) VALUES ($nombre, $cantidad, $unidadMedidaId, $productoId)"
    )

    try {
      const result = await statement.executeAsync({
        $nombre: data.nombre,
        $cantidad: data.cantidad,
        $unidadMedidaId: data.unidadMedidaId,
        $productoId: data.productoId,
      })

      const idFilaIncertada = result.lastInsertRowId

      return { idFilaIncertada }
    } catch (error) {
      throw error
    } finally {
      await statement.finalizeAsync()
    }
  }

  async function selectIngredienteByNombre(nombre: string) {
    try {
      const query = "SELECT * FROM Receta WHERE nombre LIKE ?"

      const response = await database.getAllAsync<IngredienteDatabase>(
        query,
        `%${nombre}%`
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async function updateIngrediente(data: IngredienteDatabase) {
    const statement = await database.prepareAsync(
      "UPDATE Receta SET nombre = $nombre, cantidad = $cantidad, unidadMedidaId = $unidadMedidaId, productoId = $productoId WHERE id = $id"
    )

    try {
      await statement.executeAsync({
        $id: data.id,
        $nombre: data.nombre,
        $cantidad: data.cantidad,
        $unidadMedidaId: data.unidadMedidaId,
        $productoId: data.productoId,
      })
    } catch (error) {
      throw error
    } finally {
      await statement.finalizeAsync()
    }
  }

  async function removeIngrediente(id: number) {
    try {
      await database.execAsync("DELETE FROM Producto WHERE id = " + id)
    } catch (error) {
      throw error
    }
  }

  async function showIngrediente(): Promise<IngredienteDatabase[]> {
    try {
      const query = "SELECT * FROM Ingrediente"

      const response = await database.getAllAsync<IngredienteDatabase>(query)

      return response
    } catch (error) {
      throw error
    }
  }

  return { createIngrediente, selectIngredienteByNombre, updateIngrediente, removeIngrediente, showIngrediente }
}