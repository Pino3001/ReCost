import { useSQLiteContext } from "expo-sqlite"

export type RecetaDatabase = {
  id: number
  nombre: string
  imagen: (Uint8Array | null)
  procedimiento: string
  tipoRecetaId: number
  screenshot: (Uint8Array | null)
  recetaSimple: number

}

export function operReceta() {
  const database = useSQLiteContext()

  async function createReceta(data: Omit<RecetaDatabase, "id">) {
    const statement = await database.prepareAsync(
      "INSERT INTO Receta (nombre, imagen, procedimiento, tipoRecetaId, screenshot, recetaSimple) VALUES ($nombre, $imagen, $procedimiento, $tipoRecetaId, $screenshot, $recetaSimple)"
    )

    try {
      const result = await statement.executeAsync({
        $nombre: data.nombre,
        $imagen: data.imagen,
        $procedimiento: data.procedimiento,
        $screenshot: data.screenshot,
        $tipoRecetaId: data.tipoRecetaId,
        $recetaSimple: data.recetaSimple,
      })

      const idFilaIncertada = result.lastInsertRowId

      return { idFilaIncertada }
    } catch (error) {
      throw error
    } finally {
      await statement.finalizeAsync()
    }
  }

  async function selectRecetaByNombre(nombre: string) {
    try {
      const query = "SELECT * FROM Receta WHERE nombre LIKE ?"

      const response = await database.getAllAsync<RecetaDatabase>(
        query,
        `%${nombre}%`
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async function updateRecetaComun(data: RecetaDatabase) {
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

  async function cambiarAcomun(data: RecetaDatabase) {
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

  async function showRecetas(): Promise<RecetaDatabase[]> {
    try {
      const query = "SELECT * FROM Receta"

      const response = await database.getAllAsync<RecetaDatabase>(query)

      return response
    } catch (error) {
      throw error
    }
  }

  return { createReceta, selectRecetaByNombre, updateRecetaComun, removeReceta, showRecetas, cambiarAcomun }
}