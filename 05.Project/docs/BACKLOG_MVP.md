# 3. Backlog estructurado

## 3.1 Épicas
El trabajo necesario para alinear, sanear y sincronizar el MVP se agrupa en las siguientes **Épicas**:
1. **ÉPICA 1: Infraestructura y Normalización de Datos** (Asegurar que el backend tiene la data correcta y el frontend es capaz de hablarle usando un cliente formal).
2. **ÉPICA 2: Catálogo y Navegación Dinámica** (Sustituir la lectura local de productos y categorías por consumo de la API).
3. **ÉPICA 3: Autenticación Real** (Habilitar JWT entre Front y Back; sustituir localStorage dummy).
4. **ÉPICA 4: Transaccionalidad Segura (Carrito & Checkout)** (Mover los cálculos críticos al servidor y consumir carrito real).

## 3.2 Features por épica y 3.3 Tareas técnicas por feature

### ÉPICA 1: Infraestructura y Normalización de Datos

**Feature 1.1: Data Seeding del Catálogo**
- **Tarea 1.1.1:** Crear script `seed.js` en el backend que lea los JSON actuales del frontend (`products.json`, `categories.json`) y los inserte en MongoDB asegurando las referencias cruzadas de Mongoose.
  - *Clasificación:* Alineación frontend/backend
  - *Prioridad:* Crítico

**Feature 1.2: Cliente HTTP Base de Frontend**
- **Tarea 1.2.1:** Instalar y configurar `axios` en `ecommerce-app/src/utils/http.js`.
- **Tarea 1.2.2:** Configurar `axios` interceptor genérico para inyectar automáticamente el header `Authorization: Bearer <token>` extraído del localStorage real o authContext.
- **Tarea 1.2.3:** Configurar captura centralizada de respuestas en el interceptor (interceptar 401 para hacer un forzado de logout visual).
  - *Clasificación:* Deuda técnica
  - *Prioridad:* Crítico

### ÉPICA 2: Catálogo y Navegación Dinámica

**Feature 2.1: Consumo API de Productos**
- **Tarea 2.1.1:** Refactorizar `src/services/productService.js` en frontend: reemplazar `setTimeout` y lectura JSON por `http.get('/api/products')`.
- **Tarea 2.1.2:** Validar que `ProductList` y las tarjetas rendericen correctamente con la respuesta real del servidor.
  - *Clasificación:* Feature faltante / Alineación frontend/backend
  - *Prioridad:* Alto

**Feature 2.2: Consumo API de Categorías**
- **Tarea 2.2.1:** Refactorizar `src/services/categoryService.js` para consumir `http.get('/api/categories')`.
- **Tarea 2.2.2:** Actualizar filtros de navegación lateral/superior en el layout.
  - *Clasificación:* Feature faltante / Alineación frontend/backend
  - *Prioridad:* Alto

### ÉPICA 3: Autenticación Real

**Feature 3.1: Sustitución de Auth Mockeado**
- **Tarea 3.1.1:** Refactorizar Formulario de Login para consumir `POST /api/auth/login` y capturar/guardar el token real en localStorage u otro almacén seguro.
- **Tarea 3.1.2:** Refactorizar Formulario de Registro para consumir `POST /api/auth/register`.
- **Tarea 3.1.3:** Crear/Conectar `AuthContext` para propagar el estado de autenticación basado en la existencia y validez del JWT en vez de `users.json`.
  - *Clasificación:* Feature faltante / Deuda técnica
  - *Prioridad:* Crítico

### ÉPICA 4: Transaccionalidad Segura (Carrito & Checkout)

**Feature 4.1: Migración del Carrito**
- **Tarea 4.1.1:** Decisión de diseño: Implementar Contexto Mixto (Carrito anónimo en localStorage -> al hacer login, hacer merge mediante `POST /api/cart/`).
- **Tarea 4.1.2:** Reconectar `CartContext` con el frontend para leer el ID real de Mongo y sincronizar con `GET /api/cart` cuando sea pertinente.
  - *Clasificación:* Riesgo / Deuda técnica
  - *Prioridad:* Medio

**Feature 4.2: Asegurar Checkout por Backend**
- **Tarea 4.2.1:** Modificar Componente `Checkout.jsx` suprimiendo sus cálculos de impuestos y fletes en duro ($350).
- **Tarea 4.2.2:** Enviar `POST /api/orders/` con el ID de carrito/productos.
- **Tarea 4.2.3:** Backend debe recalcular costos totales (API Side) y retornar el resumen o error por falta de stock.
- **Tarea 4.2.4:** Reflejar error manejado visualmente al usuario en caso de `400 Bad Request` retornado.
  - *Clasificación:* Riesgo / Alineación frontend/backend
  - *Prioridad:* Crítico

---

## 3.4 Priorización sugerida

Para establecer un flujo de desarrollo coherente donde las dependencias no choquen, este es el orden **estricto** de abordaje sugerido:

| Órden | Épica / Tarea | Razón |
| :---: | :--- | :--- |
| **1** | **Épica 1 (Tarea 1.1 y 1.2)** | **CRÍTICO**. Sin un backend poblado y un `axios` configurado, cualquier otro desarrollo se romperá. |
| **2** | **Épica 2 (Catálogo)** | **ALTO**. Permite probar las lecturas transversales, re-validar los diseños de las UI Cards sin tocar cosas de estado de usuario. |
| **3** | **Épica 3 (Auth)** | **CRÍTICO**. Requerido para probar posteriormente endpoints protegidos en el checkout o carrito de usuario. |
| **4** | **Épica 4 (Checkout)** | **ALTO/MEDIO**. Requiere Auth y Catálogo operando con ID reales. Corta de raíz el riesgo financiero del cálculo local. |


# 4. Historias de usuario

A continuación, se presentan las historias de usuario derivadas del backlog estructurado de la Fase 3, listas para ser tomadas por un equipo de desarrollo. Se priorizan las historias técnicas y de producto fundamentales para alinear el sistema.

---

## ÉPICA 1: Infraestructura y Normalización de Datos

### Historia 1: Carga inicial de datos de catálogo
**ID:** US-001  
**Título:** Poblado de catálogo base (Data Seeding)  
**Como** Administrador del Sistema  
**Quiero** tener un script que pueble automáticamente la base de datos de MongoDB con el catálogo actual de productos y categorías definidos en los archivos JSON estáticos  
**Para** garantizar que el backend sirva información real coincidente con los mocks visuales, permitiendo al frontend transicionar sin impactar las pantallas actuales.  

**Criterios de aceptación:**
- El script debe limpiar la colección de `Products` y `Categories`.
- El script debe crear primero las categorías iterando sobre `categories.json`.
- El script debe crear los productos iterando `products.json`, resolviendo la referencia ObjectId de la categoría correspondiente.
- Se debe poder ejecutar de manera aislada (ej. `npm run seed:data`).

**Definición de terminado:**
- Código existe, no rompe el esquema validado en Mongoose.
- Un Endpoint `GET /api/products` devuelve los mismos items que el `products.json` original.
- El código está documentado.

**Dependencias técnicas:**
- `ecommerce-api` conectada a base de datos en su archivo `.env`.

**Prioridad:** Crítico  
**Estado actual relacionado:** No implementado  

---

### Historia 2: Configuración del Cliente HTTP Base en Frontend
**ID:** US-002  
**Título:** Configuración base de Axios e Interceptors  
**Como** Desarrollador Frontend  
**Quiero** tener un cliente HTTP genérico y configurado ( Axios o Fetch Wrapper ) en `ecommerce-app/src/utils/http.js`  
**Para** realizar llamadas de red de manera ordenada, uniforme y con capacidad de interceptación centralizada (ej. agregar Headers de seguridad globalmente).

**Criterios de aceptación:**
- Se debe configurar la URL base del API (`REACT_APP_API_URL` o similar).
- Si en `localStorage` existe un JWT (`token`), debe inyectarse en el header `Authorization: Bearer <token>` de cada petición realizada.
- Si una petición responde con 401 (Unathorized), el cliente debe atrapar el error globalmente y limpiar la sesión activa del usuario.

**Definición de terminado:**
- El helper HTTP existe, se exporta y su comportamiento base está validado con pruebas unitarias o manuales básicas.
- Logs en red no muestran fugas de peticiones sin tratar.

**Dependencias técnicas:**
- Ninguna.

**Prioridad:** Crítico  
**Estado actual relacionado:** No implementado  

---

## ÉPICA 2: Catálogo y Navegación Dinámica

### Historia 3: Lectura Dinámica del Catálogo
**ID:** US-003  
**Título:** Migración del Catálogo del Frontal al Backend real  
**Como** Usuario Visitante  
**Quiero** ver el catálogo de productos cargado desde el servidor en tiempo real  
**Para** estar seguro de que visualizo la disponibilidad, nombres y precios actualizados en base de datos.

**Criterios de aceptación:**
- Funciones en `src/services/productService.js` (como `fetchProducts` o `getProductById`) ahora devuelven la promesa retornada por `http.get('/api/products')`.
- Los datos visualizados en UI (Tarjetas, Imágenes, Textos) no deben romperse por un desajuste de propiedades.

**Definición de terminado:**
- Código limpio, sin uso de `setTimeout` ni importaciones de `.json` estáticos en el folder components/services.
- No hay errores en la consola del navegador al navegar por el listado.

**Dependencias técnicas:**
- **US-001** (Data Seeding) y **US-002** (Cliente HTTP).

**Prioridad:** Alto  
**Estado actual relacionado:** Inconsistente (Mockeado en local)  

---

## ÉPICA 3: Autenticación Real

### Historia 4: Flujo Real de Inicio de Sesión
**ID:** US-004  
**Título:** Autenticación de Usuario contra la API
**Como** Usuario Registrado  
**Quiero** Iniciar sesión completando el formulario y validando mis credenciales en el servidor  
**Para** acceder de manera segura a mi cuenta, mis direcciones y poder generar órdenes.

**Criterios de aceptación:**
- El componente Login debe capturar Email y Contraseña, y mediante `POST /api/auth/login` intentar autenticar.
- Si falla, debe manejar visualmente el estado de Error (Mensaje en UI).
- Si es exitoso, extraer el JWT devolvido, almacenarlo localmente (e.g. `localStorage.setItem('token', ...)`).
- Debe sincronizar el usuario activo con el State Global (Contexto de Autenticación o Redux, etc.).

**Definición de terminado:**
- Petición red observable con Payload correcto.
- Recuperación exitosa del token.
- No hay referencias al archivo mock `users.json`.

**Dependencias técnicas:**
- **US-002** (Cliente HTTP) y disponer de un usuario administrador/test cargado en MongoDB.

**Prioridad:** Crítico  
**Estado actual relacionado:** Inconsistente (Mockeado en local)  

---

## ÉPICA 4: Transaccionalidad Segura (Carrito & Checkout)

### Historia 5: Aseguramiento de Órdenes (Checkout del lado del Servidor)
**ID:** US-005  
**Título:** Delegación del cierre de carrito al Backend  
**Como** Usuario Autenticado  
**Quiero** Confirmar mi compra y que mis totales se validen antes del pago definitivo  
**Para** que la orden sea creada de forma íntegra y mis montos finales sean exactos y justos.

**Criterios de aceptación:**
- Eliminar la lógica Frontend (`Checkout.jsx`) que suma precios y calcula porcentajes de envío/IVA.
- Al confirmar el botón "Finalizar Orden", el Front debe enviar un Payload (`POST /api/orders`) listando solo referencias: IDs de producto, cantidades y la ID de la dirección seleccionada.
- El Backend debe crear la orden en estado transaccional, calcular y reflejar los subtotales e impuestos él mismo, y retornar la orden procesada.
- Frontend muestra pantalla de confirmación con la data respondida por el Servidor.

**Definición de terminado:**
- El repositorio Frontend no utiliza funciones como `const total = cartTotal * 1.16`. Toda responsabilidad financiera está en Backend.
- Orden guardada en Mongo, referenciando correctamente un ID de Usuario, Carrito o Producto.

**Dependencias técnicas:**
- **US-004** (Token y Auth Real), ya que las rutas de Order en la API son protegidas.

**Prioridad:** Crítico  
**Estado actual relacionado:** Inconsistente (Cerrado vía localStorage nativo).
