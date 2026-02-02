import { createContext } from 'react';
import { useState } from 'react';
import '../App.css';
import BotonSwitch from '../components/BotonSwitch';

// Tarea: crea el contexto y expórtalo
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    console.log(theme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme}>
        <BotonSwitch />
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Opcional: puedes crear un Provider personalizado aquí
// o usar directamente ThemeContext.Provider en App