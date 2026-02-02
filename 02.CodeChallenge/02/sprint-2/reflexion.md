# Reflexión sobre Funciones de React

A continuación, se presenta una breve reflexión sobre el uso de cada una de las herramientas de React y librerías utilizadas en este ejercicio.

## 1. `useParams` (React Router)

Esta función es nuestro "buzón de entrada" para la información que viaja en la URL. En este proyecto, definimos una ruta dinámica `/user/:id`. `useParams` nos permite extraer ese valor `:id` dentro del componente `UserDetail`. Sin esto, el componente no sabría qué usuario específico debe buscar. Es fundamental para crear páginas dinámicas que reutilizan el mismo diseño con diferentes datos.

## 2. `useState` (React)

Es la "memoria a corto plazo" de nuestro componente. Lo usamos para dos cosas aquí:

- `user`: Para guardar la información del usuario una vez que llega desde internet (la API).
- `isLoading`: Para recordar si todavía estamos esperando esa información.
  Sin `useState`, React no sabría que la información cambió y no actualizaría la pantalla para mostrar el nombre del usuario cuando finalmente llega.

## 3. `useEffect` (React)

Es nuestro "gestor de efectos secundarios". React se dedica a pintar la pantalla, pero a veces necesitamos hacer cosas externas, como pedir datos a un servidor. `useEffect` le dice a React: "Oye, cuando termines de pintar por primera vez (o cuando cambie el `id`), ejecuta esta función para traer los datos". El array de dependencias `[id]` es vital: asegura que si cambiamos del Usuario 1 al Usuario 2, el efecto se ejecute de nuevo para buscar los nuevos datos.

## 4. `react-router-dom` (BrowserRouter, Routes, Route, Link)

Es el "sistema de navegación".

- `BrowserRouter`: Habilita la navegación en la app.
- `Routes` y `Route`: Son como un mapa; definen qué componente se muestra para cada dirección URL.
- `Link`: Es crucial porque permite cambiar de página _sin recargar todo el sitio web_, manteniendo la experiencia fluida de una aplicación moderna (Single Page Application).
