import { render, screen, fireEvent } from "@testing-library/react";
import Saludo from "./Saludo";

test("muestra el mensaje inicial", () => {
    render(<Saludo />);
    const mensaje = screen.getByText("Hola Mundo");
    expect(mensaje).toBeInTheDocument();
});

test("cambia el mensaje al hacer clic en el botón", () => {
    render(<Saludo />);
    const boton = screen.getByText("Cambiar saludo");
    fireEvent.click(boton);
    const mensaje = screen.getByText("Adiós");
    expect(mensaje).toBeInTheDocument();
});

