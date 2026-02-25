Para comenzar a generar la documentación general del proyecto denro de Open Agent Manager, se necesita iniciar una conversación con el agente y pedirle que genere la documentación general del proyecto, por medio del uso del comando /init

En otra conversación se puede utilizar el siguiente prompt para generar los tests unitarios:

Actua como un QA Engineer Senior. Escribe un test unitario usando Vitest y React Testing Library para este componente. Quiero verificar 3 cosas:

1. Que el nombre del producto se renderiza correctamente
2. Que el precio del producto tiene el formato correcto
3. Que al hacer click en el botón de agregar al carrito se llama a la función addToCart una sola vez y de forma correcta

Entonces, usando este prompt el Agente se encargará de realizar el test unitario para el componente.

Después de haber realizado la tarea del prompt dentro de la conversación de Writin Unit Test, solo se le utiliza para decir por ejemplo;

Okay, guarda el archivo y ejecuta el comando npm run test para ejecutar los tests.
