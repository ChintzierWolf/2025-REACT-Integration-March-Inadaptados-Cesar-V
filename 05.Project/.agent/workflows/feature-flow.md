# Workflow: Feature Flow (Multiagente)

Este flujo se activa para el desarrollo de cualquier nueva funcionalidad en el e-commerce.

### 1. Etapa de Definición (Pre-implementación)
- **Trigger:** Solicitud de nueva feature.
- **Acción:** El **Orchestrator** activa al **Spec-Writer**.
- **Proceso:** 
    - El Spec-Writer redacta la Spec y los CAs.
    - El **Anti-Hallucination-Reviewer** valida que la Spec no asuma archivos inexistentes.
    - El **Security-Reviewer** realiza el modelado de amenazas (STRIDE).
- **Gate:** El Orchestrator aprueba el Spec (`Estado: DRAFT -> IN PROGRESS`).

### 2. Etapa de Implementación (Desarrollo Aislado)
- **Trigger:** Spec aprobado.
- **Acción:** El Orchestrator activa a los **Builders** (Frontend/Backend).
- **Proceso:**
    - Creación de rama: `feature/[nombre]`.
    - Desarrollo siguiendo TDD (Test Driven Development).
    - Los Builders consultan al **Learning-Coach** para justificar decisiones técnicas difíciles.
- **Gate:** Commits atómicos siguiendo Conventional Commits.

### 3. Etapa de Verificación (Quality Gates)
- **Trigger:** Implementación finalizada.
- **Acción:** El Orchestrator activa al **QA-Test-Designer** y al **Code-Reviewer**.
- **Proceso:**
    - El QA ejecuta el plan de pruebas y genera evidencia.
    - El Code-Reviewer audita la limpieza y patrones de diseño.
    - El **Security-Reviewer** verifica que no haya secretos expuestos en el diff.
- **Gate:** Todos los tests pasan y no hay bloqueos de seguridad.

### 4. Etapa de Consolidación (Cierre)
- **Trigger:** Verificación exitosa.
- **Acción:** El Orchestrator integra el trabajo.
- **Proceso:**
    - Merge hacia `develop`.
    - El **Docs-Keeper** actualiza ADRs y documentación afectada.
    - El Orchestrator completa la Matriz de Cierre y actualiza el Backlog.
- **Gate:** Rama eliminada y Spec marcado como `DONE`.
