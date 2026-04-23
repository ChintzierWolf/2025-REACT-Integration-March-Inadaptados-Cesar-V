# GOBERNANZA Y ESTÁNDARES DEL REPOSITORIO

Este documento define las reglas de convivencia, calidad y mantenimiento del proyecto. Es **obligatorio** para todos los desarrolladores y agentes de IA.

## 1. Reglas Generales de Operación
- **No Alucinaciones**: Los agentes de IA no deben inventar rutas de API, librerías no instaladas o configuraciones inexistentes. Todo debe validarse contra el código real o el `INDEX.md`.
- **Estructura Atómica**: En el frontend, los componentes deben seguir la estructura de carpetas definida (Common, Layout, Pages).
- **Zustand vs React Query**: 
  - Zustand: Para estado global persistente (Auth, Cart, UI).
  - React Query: Para todos los estados que provengan del servidor (Products, Orders, Reviews).
- **Validación con Zod**: Se prefiere el uso de Zod para validaciones de esquemas en lugar de middlewares ad-hoc.

## 2. Convenciones de Naming
- **Archivos**: `camelCase` para archivos JS, `PascalCase` para componentes React (JSX).
- **Carpetas**: `kebab-case`.
- **Commits**: Seguir [Conventional Commits](https://www.conventionalcommits.org/).

## 3. Flujo de Trabajo (Git Flow Simplificado)
1.  **Branching**: Crear rama desde `develop` con el prefijo `feature/`, `bugfix/` o `docs/`.
2.  **Spec-Driven Design**: Antes de codificar, debe existir un `.md` en `/docs/specs/` con la historia de usuario y criterios de aceptación.
3.  **Tests**: Cada nueva funcionalidad DEBE incluir sus pruebas (Vitest para BE, Cypress para FE).
4.  **PR**: Los Pull Requests deben ser revisados contra los checklists de calidad en `.agent/checklists/`.

## 4. Política de Archivo
- No se borra información histórica de forma destructiva. 
- Los documentos obsoletos se mueven a `/docs/archive/` marcándolos como `[DEPRECATED]` en el título si es necesario.

## 5. Reglas Especiales para IA (Vibe Coding Controlado)
- **Verificación Continua**: Antes de proponer un cambio, la IA debe leer el archivo `BACKLOG_CONSOLIDADO.md`.
- **Prohibición de Atajos**: No se permite omitir la fase de especificación o la creación de tests por "urgencia".
- **Evidence Based**: Al terminar una tarea, se debe adjuntar evidencia de los tests ejecutados en el reporte final.

---

## 6. Firma de Compromiso
*Cualquier acción en este repositorio implica la aceptación de estas reglas para mantener la integridad técnica y documental del sistema.*
