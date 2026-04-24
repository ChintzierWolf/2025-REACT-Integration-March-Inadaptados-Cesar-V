# Checklist: Definition of Done (DoD) - Backend

Antes de entregar una unidad de trabajo de backend, el subagente debe verificar:

## Seguridad y Validación
- [ ] Todos los inputs de la API están validados (Zod/Joi).
- [ ] Se aplican controles de autorización en cada ruta sensible.
- [ ] No se exponen datos sensibles en las respuestas de la API.
- [ ] No hay secretos en el código.

## Lógica y Base de Datos
- [ ] Las consultas a la base de datos están optimizadas (uso de índices).
- [ ] Los esquemas de Mongoose reflejan fielmente el contrato.
- [ ] El manejo de errores es consistente y silencioso para el usuario.

## Tests y Calidad
- [ ] Los tests de integración/unitarios pasan al 100%.
- [ ] No hay "Magic Numbers" o strings hardcodeados.
- [ ] El código sigue los patrones Repository/Service establecidos.

## Documentación
- [ ] Spec actualizado con la Matriz de Cierre.
- [ ] Documentación de API (Swagger/Markdown) al día.
