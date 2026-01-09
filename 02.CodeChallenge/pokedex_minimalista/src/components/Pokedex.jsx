// 1. Importa los hooks que necesitas
import { useState, useEffect } from 'react';

const Pokedex = () => {
  // 2. Define el estado para guardar los Pokémon
  // Pregúntate: ¿Qué valor inicial necesita?
  const [pokemons, setPokemons] = useState([]);
  // El valor inicial que necesita useState es un array vacío
  // ya que no hay datos al inicio.

  // 3. Define el efecto que se ejecuta UNA VEZ al montar
  // ¿Por qué el array de dependencias está vacío?
  useEffect(() => {
    // 4. Llama a fetch con la URL correcta
    fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
      // 5. Primer .then(): recibe response y convierte a JSON
      .then(response => {
        const data = response.json()
        setPokemons(data)
      })
      // 6. Segundo .then(): recibe data y actualiza el estado
      .then(data => {
        console.log(data); // Observa la estructura
        // Extrae data.results y actualiza el estado
        console.log(data.results);
        setPokemons(data.results);
      });
  }, []);

  // 7. En el return, renderiza una lista <ul>
  // 8. Usa .map() para transformar cada pokemon en <li>
  // 9. Recuerda el atributo 'key' y qué mostrar de cada pokemon
  return (
    <div>
      <ul>
        {pokemons.map(pokemon => (
          <li key={pokemon.name}>{pokemon.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Pokedex;