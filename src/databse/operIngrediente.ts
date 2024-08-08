import { useSQLiteContext } from "expo-sqlite"
import { Ingrediente } from "../app/types";

export function operIngrediente() {
  const database = useSQLiteContext()

  async function createIngrediente(data: Ingrediente, idReceta: number): Promise<Ingrediente> {
      const statement = await database.prepareAsync(
        "INSERT INTO Ingrediente (idreceta, nombre, cantidad, unidadMedidaId, productoId) VALUES ($idreceta, $nombre, $cantidad, $unidadMedidaId, $productoId)"
      )

      try {
        const result = await statement.executeAsync({
          $idreceta: idReceta,
          $nombre: data.nombre,
          $cantidad: data.cantidad,
          $unidadMedidaId: data.unidadMedidaId,
          $productoId: data.productoId,
        })
        data.idReceta = idReceta;
        data.id = result.lastInsertRowId;
      } catch (error) {
        throw error
      } finally {
        await statement.finalizeAsync()
      }
      console.log('se guarda algo:', data)
    return data;

  }

  async function selectIngredienteByReceta(recetaID: number): Promise<Ingrediente[]> {
    try {
      const query = "SELECT * FROM Ingrediente WHERE idreceta = ?";
      const response = await database.getAllAsync<Ingrediente>(query, [recetaID]);
  
      // Verifica si la respuesta no está vacía y retorna la lista de ingredientes
      if (response.length === 0) {
        console.warn(`No se encontraron ingredientes para la receta con ID ${recetaID}`);
        return []; 
      }
  
      return response;
    } catch (error) {
      console.error('Error al seleccionar los ingredientes:', error);
      throw error;
    }
  }











  async function selectIngredienteByNombre(nombre: string) {
    try {
      const query = "SELECT * FROM Receta WHERE nombre LIKE ?"

      const response = await database.getAllAsync<Ingrediente>(
        query,
        `%${nombre}%`
      )
      return response
    } catch (error) {
      throw error
    }
  }

  function selectIngredienteByID(id: number): Ingrediente | null {
    try {
      const query = "SELECT * FROM Ingrediente WHERE id = ?";
      const response = database.getAllSync<Ingrediente>(query, [id]);

      // Verifica si la respuesta no está vacía
      if (response && response.length > 0) {
        return response[0]; // Devuelve el primer resultado si existe
      } else {
        return null; // Retorna null si no se encuentra ningún ingrediente
      }
    } catch (error) {
      console.error('Error al seleccionar el ingrediente:', error);
      return null;
    }
  }



  async function updateIngrediente(data: Ingrediente) {
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

  async function showIngrediente(): Promise<Ingrediente[]> {
    try {
      const query = "SELECT * FROM Ingrediente"

      const response = await database.getAllAsync<Ingrediente>(query)

      return response
    } catch (error) {
      throw error
    }
  }

  return { createIngrediente, selectIngredienteByNombre, selectIngredienteByReceta, updateIngrediente, removeIngrediente, showIngrediente, selectIngredienteByID }
}