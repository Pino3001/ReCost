import { useSQLiteContext } from "expo-sqlite";

export type UnidadMedidaData = {
    id: number
    tipoMed: string
}

export function operUnidadMedida() {
    const database = useSQLiteContext()

    async function createUnidadMedida(data: Omit<UnidadMedidaData, "id">) {
        const statement = await database.prepareAsync(
            "INSERT INTO UnidadMedida (tipoMed) VALUES ($tipoMed)"
        )

        try{
            const result = await statement.executeAsync({
                $tipoMed: data.tipoMed
            })

            const idFilaIncertada = result.lastInsertRowId
            return {idFilaIncertada}
        }catch(error){
            throw error
        }finally{
            await statement.finalizeAsync()
        }
    }

    async function selectByTipo(tipoMed: string) {
        try{
            const query = "SELECT * FROM UnidadMedida WHERE tipoMed LIKE ?"

            const response = await database.getAllAsync<UnidadMedidaData>(
                query,
                `%${tipoMed}%`
            )
            return response
        }catch (error){
            throw error
        }
    }

    async function selectByID(id: number) {
        try {
          const query = "SELECT * FROM UnidadMedida WHERE id = ?";
          const response = database.getAllSync<UnidadMedidaData>(query, [id]);
          // Verifica si la respuesta no está vacía
          if (response && response.length > 0) {
            return response[0]; // Devuelve el primer resultado si existe
          } else {
            return null; // Retorna null si no se encuentra ningúna um
          }
        } catch (error) {
          console.error('Error al seleccionar la unidad de medida:', error);
          return null;
        }
      }
    

    async function updateUnidadMedida(data:UnidadMedidaData) {
        const statement = await database.prepareAsync(
            "UPDATE UnidadMedida SET tipoMEd = $tipoMed WHERE id = $id"
        )

        try {
            await statement.executeAsync({
                $id: data.id,
                $tipoMed: data.tipoMed
            })
        }catch(error) {
            throw error
        }
    }

    async function removeUnidadMedida(id:number) {
        try {
            await database.execAsync("DELETE FROM UnidadMedida WHERE id = " + id)
        } catch (error) {
            throw error
        }
    }

    async function showUnidadMedida(): Promise<{ id: number; tipoMed: string }[]> {
        try {
            const query = "SELECT * FROM UnidadMedida"

            const response = await database.getAllAsync<UnidadMedidaData>(query);

            const uMedida = response.map(medida => ({
                id: medida.id,
                tipoMed: medida.tipoMed,
            }))
            return uMedida
        }catch (error) {
            throw error
        }

    }

    return { createUnidadMedida, selectByTipo, updateUnidadMedida, removeUnidadMedida, showUnidadMedida, selectByID}
}
