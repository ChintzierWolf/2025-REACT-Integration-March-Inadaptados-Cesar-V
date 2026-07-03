# Project Backlog (Multi-agent SSDLC)

Este archivo contiene el backlog oficial del proyecto, curado por el **Orchestrator**. Ningún subagente debe implementar funcionalidades que no estén definidas aquí.

## 📝 Tareas Pendientes (Prioridad Alta)

### 1. Refactorización de Componente Icon (Deuda Técnica)
- **ID:** `TECH-001`
- **Contexto:** El componente `Icon.jsx` es un archivo monolítico de ~27KB que contiene todos los SVGs de la aplicación.
- **Problema:** Aumenta el peso del bundle inicial, afectando negativamente el First Contentful Paint (FCP) y el tiempo de evaluación de JavaScript.
- **Solución Propuesta:** Refactorizar el componente para usar carga bajo demanda (ej. `lazy` de React con SVGs individuales, o un sprite SVG estático).
- **Rol Asignado Recomendado:** `Frontend-Builder`

### 2. Optimización de Caché en Home
- **ID:** `PERF-001`
- **Contexto:** Los productos de la página principal (Home) tardan unos milisegundos en cargar tras el montaje inicial.
- **Problema:** Impacta negativamente la percepción de velocidad (UX).
- **Solución Propuesta:** Implementar `prefetchQuery` de TanStack Query para precargar los productos clave en background o usar estado inicial hidratado.
- **Rol Asignado Recomendado:** `Frontend-Builder`

---

## ⏳ Tareas Futuras (Prioridad Media/Baja)

- **Automatización E2E:** Implementar flujos completos en Cypress (Checkout, Registro, Login) basándose en la configuración base ya existente.
- **Auditoría de Accesibilidad (a11y):** Asegurar que todos los formularios e imágenes críticas cumplan con estándares de lectores de pantalla (Aria-labels).
