import { useState } from 'react';
import './Login.css';

export default function Login() {
   const [password, setPassword] = useState('');
   const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth') === 'true');
    
  // Tarea: crea dos estados:
  // - password: para guardar lo que escribe el usuario
  // - isAuth: para saber si tiene el sello (lee localStorage al iniciar)

  const handleLogin = () => {
    if (password === '1234') {
      localStorage.setItem('isAuth', 'true');
      setIsAuth(true);
    }

    // Tarea: valida si la contraseña es correcta
    // Si lo es, guarda el sello en localStorage y actualiza isAuth
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuth');
    setIsAuth(false);
    // Tarea: elimina el sello de localStorage y actualiza isAuth
  };

  if (isAuth) {
    return (
      <div>
        <h1>Bienvenido al club secreto ✨</h1>
        <p>Contenido especial</p>
        <button onClick={handleLogout}>Salir</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Acceso restringido</h2>
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => {setPassword(e.target.value)}}
      />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}