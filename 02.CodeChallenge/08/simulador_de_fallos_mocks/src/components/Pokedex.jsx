import { useState, useEffect } from 'react';

export default function Pokedex() {
    const [pokemon, setPokemon] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://pokeapi.co/api/v2/pokemon/1')
            .then(res => res.json())
            .then(data => {
                setPokemon(data);
                setLoading(false);
            })
            .catch(err => {
                // Tarea: captura el error y actualiza el estado error
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>; // Tarea: muestra el error

    return (
        <>
            <h1>{pokemon?.name}</h1>
            <img src={pokemon?.sprites.front_default} alt={pokemon?.name} />
        </>
    );
}
