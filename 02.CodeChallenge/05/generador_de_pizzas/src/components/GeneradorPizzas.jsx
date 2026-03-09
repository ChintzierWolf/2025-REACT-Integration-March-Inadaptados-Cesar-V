import { useState } from 'react';

export default function GeneradorPizzas() {
    const [ingredientes, setIngredientes] = useState([]);
    const [tamano, setTamano] = useState('');

    const handleIngrediente = (e) => {
        // Tarea: crea dos estados:
        // - ingredientes: array vacio inicial
        // - tamano: string vacio inicial

        const valor = e.target.value;
        const checked = e.target.checked;

        // Tarea: si checked es true, agrega valor al array
        // Si es false, elimina valor del array (usa filter)
        
        if (checked) {
            setIngredientes([...ingredientes, valor]);
        } else {
            setIngredientes(ingredientes.filter(item => item !== valor));
        }
    };

    const handleTamano = (e) => {
        // Tarea: actualiza el estado tamano con e.target.value
        setTamano(e.target.value);
    };

    const confirmarPedido = () => {
        // Tarea: muestra el resumen (ingredientes + tamaño)
        alert(`Pedido confirmado: ${ingredientes.join(', ')} - ${tamano}`);
    };

    return (
        <div>
            <h2>Arma tu pizza 🍕</h2>
            {/* Añade más checkboxes para Piña y Champiñones */}
            {/* Añade más radio buttons para Mediana y Grande */}

            <h3>Ingredientes:</h3>
            <label>
                <input
                    type="checkbox"
                    value="Peperoni"
                    onChange={handleIngrediente}
                />
                Peperoni
            </label>
            <label>
                <input
                    type="checkbox"
                    value="Piña"
                    onChange={handleIngrediente}
                />
                Piña
            </label>
            <label>
                <input
                    type="checkbox"
                    value="Champiñones"
                    onChange={handleIngrediente}
                />
                Champiñones
            </label>

            <h3>Tamaño:</h3>
            <label>
                <input
                    type="radio"
                    name="tamano"
                    value="Chica"
                    onChange={handleTamano}
                />
                Chica
            </label>
            <label>
                <input
                    type="radio"
                    name="tamano"
                    value="Mediana"
                    onChange={handleTamano}
                />
                Mediana
            </label>
            <label>
                <input
                    type="radio"
                    name="tamano"
                    value="Grande"
                    onChange={handleTamano}
                />
                Grande
            </label>

            <p>Ingredientes: {JSON.stringify(ingredientes)}</p>
            <p>Tamaño: {tamano}</p>

            <button
                onClick={confirmarPedido}
                disabled={ingredientes.length === 0 || tamano === ''}
            >
                Confirmar pedido
            </button>
        </div>
    );
}
