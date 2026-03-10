import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Pokedex from './Pokedex';

test('muestra mensaje de error cuando fetch falla', async () => {
    // Tarea: usa vi.spyOn para interceptar fetch
    // Tarea: mockea fetch para que rechace con un error
    const mockFetch = vi.spyOn(window, 'fetch').mockRejectedValue(
        new Error('Error de red')
    );

    // Tarea: renderiza el componente
    render(<Pokedex />);

    // Tarea: espera el mensaje de error con findByText (asíncrono)
    const errorMsg = await screen.findByText(/Error: Error de red/i);

    // Tarea: verifica que el mensaje está en el documento
    expect(errorMsg).toBeInTheDocument();

    // Limpieza: restaura fetch original
    mockFetch.mockRestore();
});

test('muestra el pokemon cuando fetch tiene éxito', async () => {
    // Tarea: mockea fetch para que resuelva con datos falsos
    const mockFetch = vi.spyOn(window, 'fetch').mockResolvedValue({
        json: async () => ({ name: 'pikachu' })

    });

    render(<Pokedex />);

    // Tarea: espera el nombre del pokemon
    const pokemonName = await screen.findByText(/pikachu/i);
    expect(pokemonName).toBeInTheDocument();

    mockFetch.mockRestore();
});
