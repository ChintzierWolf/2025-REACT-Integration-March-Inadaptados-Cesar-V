Dentro de la sesión se va a ver y percibir el uso de patrones de inputs controlados.
Que son más que una forma de manejar los inputs de un formulario en React.
Se va a ver el uso de hooks personalizados para manejar los inputs de un formulario en React.
Se va a ver el uso de librerías para manejar los inputs de un formulario en React.
Se va a ver el uso de componentes para manejar los inputs de un formulario en React
Se va a ver el uso de patrones para manejar los inputs de un formulario en React.

Se va a elaborar un formulario con los siguientes campos:

- Nombre
- Apellido
- Email
- Teléfono
- Dirección
- Ciudad
- Estado
- Código postal
- País
- Método de pago
- Número de tarjeta
- Nombre de la tarjeta
- Fecha de expiración
- CVV
- Notas

Esto quiere decir que será bien estructurado y organizado.
Y que el front end se va a comunicar con el back end para enviar los datos del formulario y que se aseguré de que los datos sean correctos y seguros.

Establecer el modelo nos ayudará a tener una idea clara de lo que se va a hacer y cómo se va a hacer, y lograr un código más limpio y organizado para si existe algún cambio futuro sea más fácil de implementar.

El formulario se va a dividir en secciones para que sea más fácil de manejar y organizar.

1. Contacto
2. Envío
3. Pago
4. Notas

Se crearon los siguientes archivos:

- useFormReducer.js
- checkoutValidate.js
- CheckoutModel.js
- CheckoutForm.jsx
- CheckOutForm.css
- FormField.jsx
- FormField.css

Cada uno de ellos tiene un propósito específico:

- useFormReducer.js: Es un hook personalizado que se encarga de manejar el estado del formulario.
- checkoutValidate.js: Es una función que se encarga de validar los datos del formulario.
- CheckoutModel.js: Es un objeto que se encarga de definir la estructura del formulario.
- CheckoutForm.jsx: Es un componente que se encarga de renderizar el formulario.
- FormField.jsx: Es un componente que se encarga de renderizar los inputs del formulario.

Se edito el archivo Checkout.jsx para que se encargue de manejar el estado del formulario y que se aseguré de que los datos sean correctos y seguros.

Se agrego un nuevo componente CheckOutForm.jsx que se encarga de renderizar el formulario.
