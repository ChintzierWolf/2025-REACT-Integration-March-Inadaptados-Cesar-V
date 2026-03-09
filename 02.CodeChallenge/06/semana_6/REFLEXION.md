1. ¿Qué hace reduce exactamente?

El reduce recorre un array y aplica una función a cada elemento, acumulando el resultado en un valor final.

2. ¿Por qué el total se actualiza solo?

El total se actualiza solo porque React detecta que el estado ha cambiado y vuelve a renderizar el componente.

3. ¿Qué pasaría si olvidas el valor inicial (0) en reduce?

Si olvidas el valor inicial (0) en reduce, el acumulador (acc) tomará el primer valor del array como valor inicial, lo que puede dar resultados inesperados.
