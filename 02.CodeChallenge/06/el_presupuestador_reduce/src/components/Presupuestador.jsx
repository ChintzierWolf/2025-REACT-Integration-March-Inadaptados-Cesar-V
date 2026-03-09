import { useState } from "react";

export default function Presupuestador() {
    const [gastos, setGastos] = useState([]);
    const [concepto, setConcepto] = useState("");
    const [monto, setMonto] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const nuevoGasto = {
            id: Date.now(),
            concepto,
            monto: Number(monto),
        };
        setGastos([...gastos, nuevoGasto]);
        setConcepto("");
        setMonto("");
    };

    const eliminarGasto = (id) => {
        const gastosFiltrados = gastos.filter((gasto) => gasto.id !== id);
        setGastos(gastosFiltrados);
    };

    const total = gastos.reduce((acc, gasto) => acc + gasto.monto, 0);

    return (
        <div>
            <h2>Presupuestador 💰</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Concepto"
                    value={concepto}
                    onChange={(e) => setConcepto(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Monto"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                />
                <button type="submit">Agregar gasto</button>
            </form>

            <h3>Lista de gastos:</h3>
            <ul>
                {gastos.map((gasto) => (
                    <li key={gasto.id}>
                        {gasto.concepto}: ${gasto.monto}
                        <button onClick={() => eliminarGasto(gasto.id)}>X</button>
                    </li>
                ))}
            </ul>

            <h3>Total: ${total}</h3>
        </div>
    );
}
