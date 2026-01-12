### Preguntas de reflexión

Cuando termines el Paso 6, intenta responder estas preguntas con tus propias palabras (sin mirar el código). Escribir tus respuestas ayuda a que tu cerebro las recuerde mejor.

1. **Dependencias**: ¿Por qué `useEffect` tiene `[]` como dependencia? ¿Qué pasaría si fuera `[pokemons]` o no tuviera array?
   Por que el uso de '[]' dentro del useEffect es para que solo se ejecute una vez, si no se pone el array, se ejecutara cada vez que se renderice el componente.
   En cambio, si se pone [pokemons], se ejecutara cada vez que el estado de pokemons cambie.

2. **Asincronía**: ¿Por qué no colocamos `fetch` directamente en la función del componente, sin `useEffect`?
   Porque el fetch es una operacion asincrona, por lo que si no se pone useEffect, se ejecutara cada vez que se renderice el componente.
   En cambio, si se pone useEffect, se ejecutara una vez al montar el componente.

3. **Orden de ejecución**: ¿En qué orden ocurren estos eventos?

   - El componente se renderiza por primera vez
   - `fetch` comienza su petición
   - El servidor responde con datos
   - El estado se actualiza
   - El componente se renderiza nuevamente

4. **El `response.json()`**: ¿Por qué necesitamos llamar a `.json()` en la respuesta? ¿Qué devuelve?
   Porque el fetch devuelve una respuesta, y para obtener los datos de la respuesta, necesitamos llamar a .json().

5. **Keys en `.map()`**: Si usaras el índice del array (`index`) como `key` en lugar del nombre del Pokémon, ¿qué podría salir mal si luego ordenas o filtras la lista?
   Porque el orden de los elementos en el array puede cambiar, por lo que el índice puede no coincidir con el nombre del Pokémon.
   En cambio, si se pone el nombre del pokemon, se ejecutara una vez al montar el componente.
