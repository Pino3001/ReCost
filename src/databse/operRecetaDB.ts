import { useSQLiteContext } from "expo-sqlite"
import { Ingrediente, Receta } from "../app/types"
import { operIngrediente } from "./operIngrediente"


export function operReceta() {
  const { createIngrediente } = operIngrediente();
  const { selectIngredienteByReceta } = operIngrediente();
  const database = useSQLiteContext()

  async function createReceta(data: Receta): Promise<Receta> {
    await database.withTransactionAsync(async () => {
      const statement = await database.prepareAsync(
        'INSERT INTO Receta (nombre, imagen, procedimiento, tipoRecetaId, screenshot, recetaSimple) VALUES (?, ?, ?, ?, ?, ?)'
      );

      try {
        const result = await statement.executeAsync([
          data.nombre,
          data.imagen,
          data.procedimiento,
          data.tipoRecetaId,
          data.screenshot,
          data.recetaSimple,
        ]);
        data.id = result.lastInsertRowId;
        let listIngred: Ingrediente[] = [];
        for (let index = 0; index < data.ingredientes.length; index++) {
          console.log(' en los ingredientes viene:', data.ingredientes[index], data.id)
          const ings: Ingrediente = await createIngrediente(data.ingredientes[index], data.id);
          console.log(' y sale un ingrediente con el id:', ings.id)
          listIngred.push(ings);
        }
        data.ingredientes = listIngred;

      } catch (error) {
        console.error('Error en createReceta:', error);
        throw error;
      } finally {
        await statement.finalizeAsync();
      }
    });

    // Retornar el idFilaIncertada después de la transacción
    return data;
  }

  async function selectRecetaByID(id: number): Promise<Receta> {
    let igredientesReceta: Ingrediente[] = [];
    let receta: Receta | undefined;

    await database.withTransactionAsync(async () => {
        try {
            // Consulta para obtener la receta
            const queryReceta = "SELECT * FROM Receta WHERE id = ?";
            const result = database.getAllSync<Receta>(queryReceta, [id]);

            // Verifica que la receta exista
            if (result.length === 0) {
                throw new Error(`Receta con ID ${id} no encontrada`);
            }

            receta = result[0]; // Toma la primera fila del resultado

            // Consulta para obtener los ingredientes asociados a la receta
            igredientesReceta = await selectIngredienteByReceta(id);
        } catch (error) {
            console.error('Error al obtener receta o ingredientes:', error);
            throw error;
        }
    });
 
    if (!receta) {
        throw new Error(`Receta con ID ${id} no encontrada`);
    }

    return { ...receta, ingredientes: igredientesReceta };
}


















  async function updateRecetaComun(data: Receta) {
    const statement = await database.prepareAsync(
      "UPDATE Receta SET nombre = $nombre, imagen = $imagen, procedimiento = $procedimiento, tipoRecetaId = $tipoRecetaId WHERE id = $id"
    )

    try {
      await statement.executeAsync({
        $id: data.id,
        $nombre: data.nombre,
        $imagen: data.imagen,
        $procedimiento: data.procedimiento,
        $tipoRecetaId: data.tipoRecetaId
      })
    } catch (error) {
      throw error
    } finally {
      await statement.finalizeAsync()
    }
  }

  async function cambiarAcomun(data: Receta) {
    const statement = await database.prepareAsync(
      "UPDATE Receta SET nombre = $nombre, imagen = $imagen, procedimiento = $procedimiento, tipoRecetaId = $tipoRecetaId WHERE id = $id"
    )

    try {
      await statement.executeAsync({
        $id: data.id,
        $nombre: data.nombre,
        $imagen: data.imagen,
        $procedimiento: data.procedimiento,
        $tipoRecetaId: data.tipoRecetaId,
        $recetaSimple: data.recetaSimple,
      })
    } catch (error) {
      throw error
    } finally {
      await statement.finalizeAsync()
    }
  }

  async function removeReceta(id: number) {
    try {
      await database.execAsync("DELETE FROM Receta WHERE id = " + id)
    } catch (error) {
      throw error
    }
  }

  async function showRecetas(): Promise<Receta[]> {
    try {
      const query = "SELECT * FROM Receta"

      const response = await database.getAllAsync<Receta>(query)

      return response
    } catch (error) {
      throw error
    }
  }

  return { createReceta, selectRecetaByID, updateRecetaComun, removeReceta, showRecetas, cambiarAcomun }
}