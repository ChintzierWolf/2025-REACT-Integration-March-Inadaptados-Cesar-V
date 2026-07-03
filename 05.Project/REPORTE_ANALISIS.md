# Reporte Técnico de Arquitectura e Infraestructura: E-Commerce de Videojuegos

## 1. Arquitectura Base del Ecosistema
El proyecto está estructurado bajo el stack tecnológico **MERN** (MongoDB, Express, React, Node.js), dividido en dos servicios lógicos independientes:

*   **Backend RESTful API (`/ecommerce-api`)**: Desarrollado en Node.js utilizando Express.js. Gestiona la lógica de negocio, persistencia de datos y seguridad. Emplea dependencias críticas como `mongoose` (ODM para MongoDB), `jsonwebtoken` (para autenticación sin estado mediante JWT), `cors` (para control de acceso de recursos cruzados) y `helmet` (para securización de cabeceras HTTP).
*   **Frontend SPA (`/ecommerce-app`)**: Desarrollado en React.js como una Single Page Application (SPA), responsable de la capa de presentación y la interacción con el usuario.

## 2. Capa de Persistencia (Base de Datos)
La persistencia de datos está desacoplada del entorno local, utilizando una base de datos gestionada en la nube para garantizar disponibilidad y escalabilidad:

*   **Proveedor y Entorno**: MongoDB Atlas.
*   **Cadena de Conexión (URI)**: `mongodb+srv://aguaceavaz97_db_user:***@ecommerce-cluster.ttadqwq.mongodb.net/?appName=ecommerce-cluster`
*   **Identificador de la Base de Datos**: `ecommerce-api-videogames`
*   **Esquemas y Entidades de Dominio (Mongoose Models)**:
    El dominio del negocio se modela a través de 10 colecciones principales:
    1.  **`Cart`**: Gestión de estados temporales de compra por usuario.
    2.  **`Category`**: Taxonomía y clasificación de los videojuegos del catálogo.
    3.  **`Notification`**: Sistema de alertas y mensajería transaccional.
    4.  **`Order`**: Registro inmutable de transacciones financieras y pedidos completados.
    5.  **`PaymentMethod`**: Tokenización y gestión de métodos de cobro.
    6.  **`Product`**: Catálogo central de videojuegos con metadatos asociados.
    7.  **`Review`**: Sistema de calificaciones y retroalimentación de usuarios.
    8.  **`ShippingAddress`**: Gestión de logística y destinos de entrega.
    9.  **`User`**: Entidad central de autenticación, autorización y perfiles de cuenta.
    10. **`WishList`**: Intención de compra futura y guardado de productos favoritos.

## 3. Arquitectura de Despliegue en Cloud (Render)
El backend está configurado para un modelo de despliegue de **Web Service** en la plataforma PaaS (Platform as a Service) Render. La infraestructura sigue los siguientes estándares técnicos:

*   **Punto de Entrada (Entry Point)**: El flujo de ejecución de la aplicación inicia en el archivo `server.js`.
*   **Comando de Inicialización**: El orquestador de Render ejecuta la directiva estándar `"start": "node server.js"` definida en el `package.json` para levantar el proceso del servidor.
*   **Inyección Dinámica de Entorno (Environment Variables)**: 
    *   **Puerto de Escucha**: El servicio en producción no utiliza un puerto estático asignado manualmente (como el 3000 local); en su lugar, Render inyecta dinámicamente el puerto de red a través de la variable `process.env.PORT`.
    *   **Segregación de Secretos**: Variables críticas de infraestructura como `MONGODB_URI` y claves criptográficas como `JWT_SECRET` se inyectan a través del panel seguro de la plataforma. Esto previene la exposición de credenciales en el código fuente.
*   **Políticas de CORS (Cross-Origin Resource Sharing)**: El entorno de producción (`.env.production`) restringe el acceso a la API mediante la variable `CORS_ORIGIN = https://two025-react-integration-app.onrender.com`. Esta configuración autoriza explícitamente únicamente las peticiones HTTP provenientes de la instancia del frontend desplegada.
*   **Resolución de Problemas (Troubleshooting) Documentada**: El historial del proyecto cuenta con un registro en `docs/archive/ANALISIS_PENDIENTE.md` que detalla escenarios de mitigación en Render. Documenta desafíos operativos previos, tales como la gestión de caídas por *timeout* en la URL `https://two025-react-integration-march.onrender.com` y la necesidad crítica de configurar correctamente la variable de entorno `REACT_APP_API_URL` en el cliente para el enrutamiento adecuado hacia el backend de producción.
