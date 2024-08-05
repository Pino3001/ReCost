import { Slot } from "expo-router"
import { SQLiteProvider } from "expo-sqlite"
import { initializeDataBase } from "../databse/initializeDB"

export default function Layout() {
  return (
    <SQLiteProvider databaseName="mySqliteDB.db" onInit={initializeDataBase}>
      <Slot />
    </SQLiteProvider>
  )
}