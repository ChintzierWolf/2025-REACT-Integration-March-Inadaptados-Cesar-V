# 1. Diagnóstico del proyecto actual

## 1.1 Resumen ejecutivo
El MVP e-commerce se encuentra en un estado de **desarrollo asimétrico**. El backend (`ecommerce-api`) está muy avanzado, contando con una API robusta, rutas operativas, validaciones formales, y un ecosistema de modelado en Mongoose, cubierto por pruebas automatizadas de integración. El frontend (`ecommerce-app`), si bien tiene una estructura React bien definida basada en Layouts, Pages, Contexts y Components, está operando de forma 100% simulada y aislada, alimentándose de mocks físicos en JSON y simulando latencias sin enviar ni extraer información real hacia/desde el servidor.

**Objetivo crítico a corto plazo:** Conectar ambos mundos. Migrar el frontend de sus flujos en localStorage/mocks a consumir los endpoints reales.

## 1.2 Estado del backend
**Solidez alta, pero requiere calibración fina de payload.**
- La API de Node/Express está estructurada e implementa un router jerárquico (`users`, `products`, `orders`, `cart`, `categories`...).
- Implementa JWT Auth en rutas críticas y Middlewares robustos.
- La suite de tests en Vitest sufre de fricción de ambiente en máquina local (`ReferenceError` sobre `globals` de ambiente).
- *Corrección reciente en fase de descubrimiento:* Se ajustó la firma del modelo de MongoDB `Product` (campo `image` a `String`, y varios campos opcionales) para que el backend pueda absorber la semilla de datos `products.json` que provee el frontend sin disparar errores de esquema.

## 1.3 Estado del frontend
**Estructurado visualmente, pero desconectado (Dummy State).**
- Emplea `react-router-dom` con una organización adecuada.
- Existen componentes atómicos aislados (`Button`, `Input`, `Badge`).
- Los servicios del frontend (`productService.js`, `userService.js`, etc.) devuelven las respuestas simuladas resolviendo Promises con retardos (`setTimeout`).
- No existe cliente HTTP real gestionado centralizadamente (axios o fetch hook global).

## 1.4 Estado de persistencia de datos
Es el mayor gap técnico del proyecto actualmente, ya que no existe sincronización, y presenta una dicotomía:
- **Frontend usa exclusivamente `localStorage` y archivos estáticos (estado simulado)**. 
  - `CartContext`: Lee y escribe el carrito y sus precios de sesión en la llave `cart` de localStorage.
  - Checkout/Órdenes: Graba pseudo-historiales en localStorage.
  - `src/data/`: Proveen catálogos "congelados" en JSON.
- **Backend usa base de datos (MongoDB)**. 
  - Mantiene su propio modelo formal y transaccional mediante Mongoose en las tablas `Users`, `Products`, `Carts`, `Orders`.
- **Desalineamiento**: No hay un flujo en vivo que persista los datos del front en el de base de datos o viceversa. Están duplicados funcionalmente pero totalmente aislados operativamente.

## 1.5 Flujos funcionales detectados
1. **Listado y Filtrado de Productos**: Funcional en el UI, buscando en el JSON estático, usando componentes y un layout consistente.
2. **Carrito de Compras**: Funcional 100% en el UI, retenido en memoria y en localStorage local a través del Context API. No realiza cálculo en base de datos.
3. **Flujo de Checkout (3 Pasos)**: 
   - Envío (Simula direcciones pre-cargadas y alta de nuevas usando form reducers y localStorage).
   - Pago (Idem anterior).
   - Confirmación (Cálculo estático con impuestos simulados).
4. **Flujo de Autenticación**: Frontend lo mapea como activo, pero el login/registro depende de mocks y contexto virtual (`users.json`). El backend está preparado para JWT real.

## 1.6 Riesgos técnicos y funcionales
- **Doble Lógica de Negocio (Duplicidad de fuentes de verdad):** El cálculo de precios de carrito e impuestos se está calculando en React en el frontend, mientras que el backend espera ser el dueño de la verdad al persistir órdenes. Esto rompe con el *Security by Design* del SSDLC, donde el servidor debe mandar y auditar precios.
- **Falta de Manejo Real de Errores UX:** Al funcionar sobre mocks infalibles en JS (el `Promise.resolve` no falla), el frontend no posee flujos robustos de recuperación frente a validaciones caídas (`400 Bad Request`) o tokens expirados (`401 Unauthorized`), situaciones que aparecerán de inmediato al conectar a los endpoints reales del backend.
- **Fricción de Testing**: El bloqueo actual de Vitest esconde si la lógica de borrado y dependencias (ej: eliminar producto del carrito en base de datos) trabaja apropiadamente bajo concurrencia.

## 1.7 Supuestos e hipótesis pendientes de validar
- **Hipótesis de Data Seeding:** Para probar la integración, se tendrá que cargar en MongoDB al menos un catálogo 1-a-1 idéntico al que provee `ecommerce-app/src/data/products.json` y `categories.json` para no romper la UI. Se desconoce si existe un script de `seed.js` formal en el backend.
- **Hipótesis de Componentes UI:** Asumo que existe un framework subyacente de CSS para `common/` o que todo el proyecto se rige bajo ThemeContext puro en Vanilla CSS. Las mejoras anteriores proponían Atomic Design, pero se asume que las definiciones actuales del frontend son la base firme visual.


# 2. Spec del proyecto

## 2.1 Descripción general del sistema
Módulo e-commerce (MVP) enfocado en la venta de videojuegos, consolas y accesorios. El sistema está conformado por un Frontend en React (Single Page Application) diseñado modularmente bajo Atomic Design y un Backend API REST en Node.js (Express) con persistencia de datos en MongoDB.

## 2.2 Objetivo del producto
Proveer una experiencia de compra en línea fluida, emulando los flujos estándar de la industria (tipo Amazon/MercadoLibre), permitiendo a los usuarios navegar catálogos, agregar productos al carrito y ejecutar un flujo de checkout escalonado.

## 2.3 Problema que resuelve
Brindar una plataforma transaccional completa y escalable para una tienda de videojuegos, estandarizando y asegurando las capas de presentación (interfaz de cliente) con operaciones transaccionales seguras y auditables (inventario, órdenes y pagos).

## 2.4 Alcance actual
- **Frontend:** Existe una interfaz responsiva navegable que simula consultas asíncronas leyendo de diccionarios locales (`JSON` estáticos) y maneja el estado del carrito e historial en el navegador de los usuarios de forma local (`localStorage`).
- **Backend:** Existe una API funcional protegida con JWT, equipada con modelos de datos sólidos (`Mongoose`) en Mongo y flujos de QA (Testing) muy avanzados.
- **Brecha (Current Gap):** El frontend _no hace peticiones_ al backend. Ambos componentes operan como silos aislados. Todo es simulado de cara al cliente.

## 2.5 Alcance objetivo
El sistema debe estar unificado. El Frontend debe consumir **exclusivamente** los endpoints del Backend para las operaciones de lectura (catálogo) y escritura (carrito, checkout, registro, inicio de sesión). El sistema debe ser una única fuente de verdad regida por el Backend, bajo los principios del protocolo de seguridad *SSDLC*.

## 2.6 Módulos del sistema

### Módulo: Autenticación y Usuarios
- **Propósito:** Gestión de identidades, roles (customer, admin, guest) y seguridad.
- **Estado actual:** Frontend simula login (`users.json`). Backend tiene rutas funcionales (`/auth/login`, `/auth/register`).
- **Componentes:** Formularios de Login/Registro.
- **Endpoints:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/users/profile`.
- **Modelos de datos:** `User` (displayName, email, hashPassword, role).
- **Reglas de negocio:** Contraseñas encriptadas, roles jerárquicos, JWT de autenticación.
- **Gaps pendientes:** Conectar `AuthContext` (si existe o si se crea) a la API real. Remover `users.json`.

### Módulo: Catálogo de Productos
- **Propósito:** Mostrar inventario al cliente y permitir búsquedas/filtros.
- **Estado actual:** Frontend lee de `products.json` y simula llamadas de red con `setTimeout`. Backend cuenta con el esquema de productos y lógica de filtrado probada en QA.
- **Componentes:** Componentes de listado, tarjetas de producto, filtrado de categorías.
- **Endpoints:** `GET /api/products/`, `GET /api/products/category/:id`.
- **Modelos de datos:** `Product` (name, price, stock, image, category), `Category`.
- **Reglas de negocio:** Los precios e inventarios mandan desde el servidor. Ocultar productos sin stock activo.
- **Gaps pendientes:** Modificar `productService.js` para usar cliente HTTP real y hacer un *Seed* en la base de datos que refleje inicialmente a `products.json`.

### Módulo: Carrito de Compras
- **Propósito:** Almacén temporal de productos seleccionados por el usuario para su posterior compra.
- **Estado actual:** Funciona enteramente local en el navegador del usuario vía Context API y `localStorage`. Backend tiene entidad de Carrito (`/api/cart`).
- **Componentes:** `CartContext.jsx`, vistas laterales o completas del carrito.
- **Endpoints:** `GET /api/cart/`, `POST /api/cart/`.
- **Modelos de datos:** `Cart` (user, products[]).
- **Reglas de negocio:** Los precios los valida el servidor.
- **Gaps pendientes:** Definir comportamiento: ¿Carrito de visitante en localstorage hasta que loguee o carrito siempre en base de datos? Se sugiere migración a DB.

### Módulo: Checkout y Órdenes
- **Propósito:** Confirmar compra, cobrar y descontar inventario.
- **Estado actual:** Frontend simula pasos estáticos y cierra orden en localStorage. Backend posee transacciones y status (`pending`, `shipped`, etc.).
- **Componentes:** `Checkout.jsx` y su flujo (Shipping, Payment, Confirm).
- **Endpoints:** `POST /api/orders/`, `GET /api/orders/user/:id`.
- **Modelos de datos:** `Order` (products, total, status), `PaymentMethod`, `ShippingAddress`.
- **Reglas de negocio:** Cálculo de impuestos (16%), envío fijo ($350 o gratis >$1000). Stock debe descontarse. Las direcciones y tarjetas deben crearse referenciadas al Usuario.
- **Gaps pendientes:** Cambiar el cálculo del frontend para que el backend valide el subtotal y genere el registro `Order`. Frontend solo debe mostrar información.

## 2.7 Arquitectura funcional actual
- Aplicación de consumo web directa al cliente sin intermediarios.
- Navegación React SPA (Vistas re-renderizables sin recarga completa).
- Dependencia alta del cliente para efectuar cálculos financieros (Vulnerabilidad).
- Ausencia general de llamadas de red auténticas hacia su contraparte operativa (API).

## 2.8 Arquitectura técnica actual
- **Frontend:** React 19, `react-router-dom`, context global (`CartContext`, `ThemeContext`). Componentes estilizados que reflejan atomic design (`Button`, `Input`).
- **Backend:** Node v18+; Express.js (Routers separados funcionalmente), global error handler implementado. 
- **Base de datos:** MongoDB. Comunicación mediante biblioteca `mongoose`.
- **Manejo de estado:** Context API (Local, no síncrono).
- **Persistencia local vs persistencia remota:** LocalStorage actualmente es dueño del carrito y sesiones mock. MongoDB actualmente está vacío u operando con data volátil (En QA suite, todo pasa in-memory; en el entorno dev, se conecta por URL `.env` a la BDD).
- **Autenticación:** JWT expedido en Backend, pero totalmente no implementado en llamadas de Frontend.
- **Validaciones:** `express-validator` fuertemente adaptado.
- **Manejo de errores:** Captura centralizada en router pasándolo al Global Error middleware de backend (`next(error)`). En el frontend casi inexistente por el uso de `Promise.resolve` mocks.

## 2.9 Inconsistencias detectadas
- **Riesgo Financiero:** El carrito en UI (`CartContext.jsx`) calcula el Total localmente. Si la API confía ciegamente en este total en vez de calcularlo en base a su propia lectura de base de datos de los ID de producto, estamos expuestos a inyecciones manuales (el usuario manipulará el localStorage enviando precios falsos).
- **Lógica Mockeada:** Frontend maneja datos irrelevantes o limitados, como tarjetas de pago almacenadas como strings nativos en local en lugar de refenciar un objeto Payment del Backend.

## 2.10 Reglas funcionales del sistema
1. Un visitante no autenticado puede ver catálogo, pero debe autenticarse para comprar.
2. Si el subtotal de compra supera o iguala a $1000, el envío es gratuito. Si es menor, cuesta $350.
3. El IVA aplicado general es rígido a un 16%.
4. No se puede comprar stock negativo o no disponible.

## 2.11 Reglas técnicas del sistema
1. Todo cambio técnico requiere SSDLC (Security By Design).
2. Los repositorios de Mongoose envían y recuperan todo usando Promesas Asincrónicas.
3. El JWT debe ser transmitido en un Header (`Authorization: Bearer <token>`).
4. Los endpoints deben testearse según el Protocolo establecido (Integration tests con Vitest / Supertest).

## 2.12 Deuda técnica identificada
- Ausencia de cliente HTTP modular (`axios` u otra de Request/Response) en el root del frontend. Los `services/` son solo promesas con timer.
- Falsos positivos en Componentes UI; el UI se siente reactivo, pero el manejo de errores reales (404, 500) o estados de carga reales (debido a latencias impredecibles) no ha sido programado o no se prueba.
- Dificultades o warnings provenientes de configuración en ambiente local en entorno de pruebas Vitest backend que ensucia la consola e inhibe un CI automatizado estable.

## 2.13 Riesgos
- Al conectar Base de Datos con Frontend, los _layouts_ o estilos CSS preestablecidos podrían romperse si el Backend manda un payload inconsistente al formato esperado originariamente. Por ejemplo, imágenes que tarden demasiado o descripciones muy largas.
- Resistencia del usuario o complejidad artificial a crear roles si es que la autenticación empieza a volverse muy restrictiva.

## 2.14 Recomendaciones de normalización y cierre de gaps
1. **Poblar la Base de Datos (Data Seeding):** Crear un script backend que lea los JSON `products.json` y `categories.json` del frontend y los vuelque directamente a MongoDB para garantizar absoluta paridad.
2. **Setup de Cliente HTTP:** Configurar Axios o Fetch como cliente base dentro de `src/utils` del Front, agregándole un Interceptor que inyecte el JWT del usuario automáticamente en cada red, así como captura centralizada de errores (logoutear usuario si se recibe un 401 Unathorized).
3. **Servicios (Refactor Front):** Eliminar todos los `setTimeout` de la capa de `/services/` del Frontend. Cada función debe reemplazar su iteración y retornar directamente la Promise de axios (ej. `return http.get('/api/products')`).
4. **Backend manda en Checkouts:** Todo cálculo (IVA, envío y precios totales) del Frontend debe ser borrado con prioridad e instinto de lectura, cediéndole el cálculo financiero a controladores transaccionales seguros en el backend.

## 2.15 Propuesta de documentación final
Al cerrar esta intervención integral del proyecto, en el repositorio solo deberían persistir de forma canónica los siguientes documentos:
- **`README.md` (Raíz)**: Instalación general del Monorepo.
- **`docs/SSDLC_Protocolo_Operativo.md`**: Reglas intocables de operación.
- **`docs/Arquitectura_Tecnica.md`**: Versión purgada de AGENTS.md sumando front y back en un vistazo.
- **`docs/QA_Strategy.md`**: Fusión y oficialización de guías y mapas de pruebas E2E/Integration.
