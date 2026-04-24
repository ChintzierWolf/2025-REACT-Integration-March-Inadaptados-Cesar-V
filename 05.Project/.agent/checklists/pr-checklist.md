# Checklist: Revisión de Pull Request (PR)

Esta checklist es de uso obligatorio para el **Orchestrator** y el **Code-Reviewer** antes de autorizar un merge hacia `develop`.

## Integridad Documental
- [ ] ¿Existe un Spec aprobado y referenciado?
- [ ] ¿Se ha actualizado la Matriz de Cierre en el Spec?
- [ ] ¿Se ha actualizado el Backlog?

## Calidad Técnica
- [ ] ¿Pasan todos los Quality Gates (Linting, Tests, SAST)?
- [ ] ¿El diff es atómico y se ajusta al Spec?
- [ ] ¿Se ha evitado el código duplicado?

## Seguridad
- [ ] ¿El Security-Reviewer ha validado que no hay secretos?
- [ ] ¿Se han cubierto las amenazas STRIDE identificadas en el Spec?

## Mantenibilidad
- [ ] ¿El código es legible y sigue las convenciones del proyecto?
- [ ] ¿Se han generado nuevos ADRs si hubo cambios de arquitectura?
- [ ] ¿El impacto en otros módulos ha sido verificado?
