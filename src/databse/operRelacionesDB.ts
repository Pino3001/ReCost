import { useSQLiteContext } from "expo-sqlite"

export type RecetaIngredienteDataBase = {
    recetaId: number,
    ingredienteId: number,
}

export function operRelaciones() {
  const database = useSQLiteContext()

  async function createRelacionRI(data: RecetaIngredienteDataBase) {
    const statement = await database.prepareAsync(
      "INSERT INTO RecetaIngrediente (recetaId, ingredienteId) VALUES ($recetaId, $ingredienteId)"
    )

    try {
      const result = await statement.executeAsync({
        $recetaId: data.recetaId,
        $ingredienteId: data.ingredienteId,
      })

      const idFilaIncertada = result.lastInsertRowId

      return { idFilaIncertada }
    } catch (error) {
      throw error
    } finally {
      await statement.finalizeAsync()
    }
  }

  async function selectRelacionByReceta(recetaId: number) {
    try {
      const query = "SELECT * FROM RecetaIngrediente WHERE recetaId LIKE ?"

      const response = await database.getAllAsync<RecetaIngredienteDataBase>(
        query,
        `%${recetaId}%`
      )
      return response
    } catch (error) {
      throw error
    }
  }


  async function showRelacion(): Promise<RecetaIngredienteDataBase[]> {
    try {
      const query = "SELECT * FROM RecetaIngrediente"

      const response = await database.getAllAsync<RecetaIngredienteDataBase>(query)

      return response
    } catch (error) {
      throw error
    }
  }

  return { createRelacionRI, selectRelacionByReceta, showRelacion }
}