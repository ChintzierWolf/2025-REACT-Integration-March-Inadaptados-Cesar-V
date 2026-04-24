# Workflow: Bugfix Flow (Multiagente)

Este flujo se activa para la corrección de errores en entornos de desarrollo o producción.

### 1. Etapa de Diagnóstico
- **Trigger:** Reporte de bug.
- **Acción:** El **Orchestrator** activa al **QA-Test-Designer** y al **Anti-Hallucination-Reviewer**.
- **Proceso:** 
    - El QA intenta reproducir el bug y redacta un test que falle (Red Phase).
    - El Anti-Hallucination-Reviewer localiza los archivos y líneas exactas del fallo.
- **Gate:** Bug reproducido y causa raíz identificada.

### 2. Etapa de Especificación de Corrección
- **Trigger:** Causa raíz identificada.
- **Acción:** El **Spec-Writer** actualiza/crea un Spec de bugfix.
- **Proceso:**
    - Definición de CAs específicos para la corrección.
    - Evaluación de impacto en otros módulos.
- **Gate:** Spec de corrección aprobado por el Orchestrator.

### 3. Etapa de Reparación
- **Trigger:** Spec de bugfix aprobado.
- **Acción:** El **Builder** correspondiente implementa la solución.
- **Proceso:**
    - Rama: `bugfix/[nombre]`.
    - Implementación hasta que el test creado en la etapa 1 pase (Green Phase).
- **Gate:** El test de regresión pasa exitosamente.

### 4. Etapa de Verificación y Cierre
- **Trigger:** Solución implementada.
- **Acción:** El **Security-Reviewer** y el **Orchestrator** validan el cambio.
- **Proceso:**
    - Verificación de que la solución no introduzca nuevas vulnerabilidades.
    - Merge e integración.
    - El **Docs-Keeper** documenta la "Lección Aprendida" en el Spec.
- **Gate:** Spec marcado como `DONE`.
