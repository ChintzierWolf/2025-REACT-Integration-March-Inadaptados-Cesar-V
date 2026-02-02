import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null); // memoria del componente
  const [isLoading, setIsLoading] = useState(true); // indicador de espera

  useEffect(() => {
    // Tarea: aquí "levanta el teléfono" a
    // https://jsonplaceholder.typicode.com/users/{id}
    // Usa fetch (o async/await), actualiza `user` y `isLoading`.
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    .then(response => response.json())
      .then(data => {
        setUser(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      {user && <h1>{user.name}</h1>}
      {!user && <p>Usuario no encontrado</p>}
    </div>
  );
}