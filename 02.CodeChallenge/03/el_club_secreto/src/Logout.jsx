import { useState } from 'react';

export default function Logout() {
   const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth') === 'true');
    
  // Tarea: crea dos estados:
  // - password: para guardar lo que escribe el usuario
  // - isAuth: para saber si tiene el sello (lee localStorage al iniciar)

  const handleLogout = () => {
    localStorage.removeItem('isAuth');
    setIsAuth(false);
  };

  return (
    <div>
      {isAuth && <button onClick={handleLogout}>Salir</button>}
    </div>
  );
}
