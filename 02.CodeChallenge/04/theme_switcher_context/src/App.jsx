import { useState } from 'react';
import { ThemeContext } from './contexts/ThemeContext';
import Layout from './components/Layout';
import './App.css';

export default function App() { 
  const [theme, setTheme] = useState('light');

  // Tarea: crea un estado theme con valores 'light' o 'dark'
  return (
    <div className={theme}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <Layout />
      </ThemeContext.Provider>
    </div>
  );
}
