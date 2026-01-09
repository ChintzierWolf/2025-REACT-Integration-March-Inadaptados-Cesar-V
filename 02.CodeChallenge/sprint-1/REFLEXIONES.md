### Preguntas de reflexión

Cuando termines el Paso 6, intenta responder estas preguntas con tus propias palabras (sin mirar el código). Escribir tus respuestas ayuda a que tu cerebro las recuerde mejor.

1. **Dependencias**: ¿Por qué `useEffect` tiene `[]` como dependencia? ¿Qué pasaría si fuera `[pokemons]` o no tuviera array?

2. **Asincronía**: ¿Por qué no colocamos `fetch` directamente en la función del componente, sin `useEffect`?

3. **Orden de ejecución**: ¿En qué orden ocurren estos eventos?

   - El componente se renderiza por primera vez
   - `fetch` comienza su petición
   - El servidor responde con datos
   - El estado se actualiza
   - El componente se renderiza nuevamente

4. **El `response.json()`**: ¿Por qué necesitamos llamar a `.json()` en la respuesta? ¿Qué devuelve?

5. **Keys en `.map()`**: Si usaras el índice del array (`index`) como `key` en lugar del nombre del Pokémon, ¿qué podría salir mal si luego ordenas o filtras la lista?
