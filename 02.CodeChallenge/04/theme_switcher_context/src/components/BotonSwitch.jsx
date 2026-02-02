import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import '../App.css';

export default function BotonSwitch() {
  // Tarea: usa useContext para obtener theme y setTheme
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button onClick={toggleTheme}>
      {/* Muestra el tema actual o un ícono */}
      {theme === 'light' ? '☀️' : '🌙'}
    </button>
  );
}