// src/themes/theme.js
import { DefaultTheme } from 'react-native-paper';

const themePlaceholder = {
  ...DefaultTheme,
  fonts: {
    ...DefaultTheme.fonts,
    placeholder: {
      fontSize: 1, // Cambia el tamaño de la letra del placeholder 
    },
  },
  colors: {
    ...DefaultTheme.colors,
    placeholder: 'white', // Cambia el color del placeholder aquí
  },
};

export default themePlaceholder;
