
import React, {useState, useEffect} from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaView, StyleSheet } from 'react-native';
import Navigation from './src/app/navigator/navigator';
import { initializeDataBase } from './src/databse/initializeDB';
import * as Font from 'expo-font';


const loadFonts = () => {
  return Font.loadAsync({
      'IndieFlower-Regular': require('./assets/fonts/IndieFlower-Regular.ttf'),
      'Sanches-Regular': require('./assets/fonts/Sanchez-Regular.ttf'),
  });
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => {
        setFontsLoaded(true);
    });
}, []);

if (!fontsLoaded) {
    return <SafeAreaView />;
}
  return (
    <SQLiteProvider databaseName="mySqliteDB.db" onInit={initializeDataBase}>
      <SafeAreaView style={styles.container}>
        <Navigation />
      </SafeAreaView>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});