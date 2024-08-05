import { type SQLiteDatabase } from "expo-sqlite";

// Función para configurar la base de datos
export async function initializeDataBase(db: SQLiteDatabase) {
  try {
    await db.execAsync(
      
      `CREATE TABLE IF NOT EXISTS UnidadMedida (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipoMed TEXT NOT NULL
      );
      INSERT OR IGNORE INTO UnidadMedida (id, tipoMed) VALUES (1, 'Ml');
      INSERT OR IGNORE INTO UnidadMedida (id, tipoMed) VALUES (2, 'Gr');

      CREATE TABLE IF NOT EXISTS Producto (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        precio REAL NOT NULL,
        cantidadXcompra REAL NOT NULL,
        unidadMedida INTEGER NOT NULL,
        proveedor TEXT,
        FOREIGN KEY (unidadMedida) REFERENCES UnidadMedida(id)
      );

      CREATE TABLE IF NOT EXISTS Ingrediente (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        cantidad REAL NOT NULL,
        unidadMedidaId INTEGER,
        productoId INTEGER,
        FOREIGN KEY (unidadMedidaId) REFERENCES UnidadMedida(id),
        FOREIGN KEY (productoId) REFERENCES Producto(id)
      );

      CREATE TABLE IF NOT EXISTS TipoReceta (
        id INTEGER PRIMARY KEY,
        tipo TEXT NOT NULL
      );
      INSERT OR IGNORE INTO TipoReceta (id, tipo) VALUES (1, 'Cocina');
      INSERT OR IGNORE INTO TipoReceta (id, tipo) VALUES (2, 'Pasteleria-Panaderia');


      CREATE TABLE IF NOT EXISTS Receta (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        imagen BLOB,
        procedimiento TEXT,
        tipoRecetaId INTEGER,
        screenshot BLOB,
        recetaSimple INTEGER NOT NULL,
        FOREIGN KEY (tipoRecetaId) REFERENCES TipoReceta(id)
      );

      CREATE TABLE IF NOT EXISTS RecetaIngrediente (
        recetaId INTEGER,
        ingredienteId INTEGER,
        PRIMARY KEY (recetaId, ingredienteId),
        FOREIGN KEY (recetaId) REFERENCES Receta(_id),
        FOREIGN KEY (ingredienteId) REFERENCES Ingrediente(_id)
      );`
    );
    console.log("Base de datos y tablas creadas correctamente");
  } catch (error) {
    console.error("Error al crear la base de datos y las tablas:", error);
  }
}

export async function dropAllTables(db: SQLiteDatabase) {
  try {
    await db.execAsync(
      `PRAGMA foreign_keys = OFF; -- Desactiva temporalmente las claves foráneas

      DROP TABLE IF EXISTS RecetaIngrediente;
      DROP TABLE IF EXISTS Receta;
      DROP TABLE IF EXISTS TipoReceta;
      DROP TABLE IF EXISTS Ingrediente;
      DROP TABLE IF EXISTS Producto;
      DROP TABLE IF EXISTS UnidadMedida;

      PRAGMA foreign_keys = ON; -- Vuelve a activar las claves foráneas`
    );
    console.log("Todas las tablas han sido eliminadas correctamente");
  } catch (error) {
    console.error("Error al eliminar las tablas:", error);
  }
}