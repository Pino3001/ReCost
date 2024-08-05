import { useSQLiteContext } from "expo-sqlite";

export type TipoRecetaDataBase = {
  id: number;
  tipo: string;
};

export function operTipoReceta() {
  const database = useSQLiteContext();

  async function selectTipoReceta(id: number) {
    try {
      const query = "SELECT * FROM TipoReceta WHERE id LIKE ?";

      const response = await database.getAllAsync<TipoRecetaDataBase>(
        query,
        `%${id}%`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async function showTipoReceta(): Promise<{ id: number; tipo: string }[]> {
    try {
      const query = "SELECT * FROM TipoReceta";

      const response = await database.getAllAsync<TipoRecetaDataBase>(query);

      const Treceta = response.map((tipReceta) => ({
        id: tipReceta.id,
        tipo: tipReceta.tipo,
      }));
      return Treceta;
    } catch (error) {
      throw error;
    }
  }

  return { selectTipoReceta, showTipoReceta };
}
