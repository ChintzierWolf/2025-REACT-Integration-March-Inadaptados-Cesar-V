# Viernes 6 de Febrero del 2026

## ¿Para que es el useState?

El UseState es un hook de React que nos permite manejar el estado de un componente
Sirve para que el componente sepa que algo cambio y se vuelva a renderizar
Controla el ciclo de vida del componente, con el useState podemos hacer que el componente se renderice de nuevo cuando el estado cambie

Si se ocupa una variable con let dentro de react, no se va a renderizar el componente cuando la variable cambie ya que no es una variable de estado, como lo es useState

En cambio si se utiliza el useState de manera; const [state, setState] = useState(initialState)

El state es el valor actual del estado
El setState es la funcion que nos permite cambiar el estado
El initialState es el valor inicial del estado

Detecta el cambio dentro de setState y vuelve a renderizar el componente dentro de la funcion App
el state es inmutable, no se puede cambiar directamente, se debe usar setState para cambiarlo
y si se quiere cambiar el estado de un objeto, se debe crear un nuevo objeto con los cambios

## ¿Para que es un reducer?

El reducer es una funcion que se encarga de manejar el estado de un componente

Cuando comenzamos a tener muchas variables de estado, el useState se vuelve muy complejo de manejar, por lo que se utiliza un reducer para manejar el estado de un componente

El reducer es una funcion que recibe dos parametros: state y action
El state es el estado actual del componente
El action es un objeto que contiene la informacion que se necesita para cambiar el estado

## ¿Para que es el useReducer?

El useReducer es un hook de React que nos permite manejar el estado de un componente
Sirve para que el componente sepa que algo cambio y se vuelva a renderizar
Controla el ciclo de vida del componente, con el useReducer podemos hacer que el componente se renderice de nuevo cuando el estado cambie

## ¿Para que es el useContext?

El useContext es un hook de React que nos permite manejar el estado de un componente
Sirve para que el componente sepa que algo cambio y se vuelva a renderizar
Controla el ciclo de vida del componente, con el useContext podemos hacer que el componente se renderice de nuevo cuando el estado cambie

## ¿Para que es el useMemo?

El useMemo es un hook de React que nos permite manejar el estado de un componente
Sirve para que el componente sepa que algo cambio y se vuelva a renderizar
Controla el ciclo de vida del componente, con el useMemo podemos hacer que el componente se renderice de nuevo cuando el estado cambie
