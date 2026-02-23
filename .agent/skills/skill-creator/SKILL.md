---
name: Skill Creator
description: "Meta-habilidad para crear otras habilidades nuevas siguiendo los estándares de agencia de Antigravity. Se activa con 'Crea una nueva Agent Skill para [tarea]'."
---

# Goal
El resultado esperado es una nueva carpeta de habilidad (skill) dentro de `.agent/skills/` (local) o `~/.gemini/antigravity/skills/` (global) que contenga un archivo `SKILL.md` perfectamente estructurado, documentando cómo el agente debe ejecutar una nueva tarea recurrente.

# Instructions
1. Analizar la tarea solicitada por el usuario (el "gatillo" semántico).
2. Determinar el nombre único de la habilidad en formato kebab-case (ej: `auditoria-seo`).
3. Crear la carpeta para la habilidad en el directorio correspondiente (`.agent/skills/[nombre-habilidad]/`).
4. Generar el archivo `SKILL.md` dentro de la carpeta con la siguiente estructura (en Español Rioplatense/Latino):
   - **YAML Frontmatter**: Debe incluir `name` (Nombre único) y `description` (Descripción específica que actúa como el "gatillo" semántico).
   - **Goal**: Una descripción clara del resultado esperado al ejecutar esta habilidad.
   - **Instructions**: Un protocolo paso a paso detallado de cómo realizar la tarea (ej: "Primero consulta la base de datos, luego valida el modelo"). Fomentar el uso de comandos, herramientas de búsqueda y lectura antes de editar.
   - **Constraints**: Reglas de seguridad y restricciones (ej: "Nunca borrar datos sin confirmación humana", "Asegurar integridad de datos en reservas").
5. Confirmar al usuario que la habilidad ha sido creada exitosamente y está lista para ser usada.

# Constraints
- Siempre incluir el YAML frontmatter con `name` y `description`.
- Nunca sobreescribir una habilidad existente sin pedir confirmación explícita al usuario.
- El idioma a utilizar en el contenido de la skill debe ser el definido por las reglas globales: Español Rioplatense/Latino (neutro pero natural para Uruguay).
