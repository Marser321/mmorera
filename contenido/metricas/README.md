# Métricas

El agente publicador carga un archivo por mes (`AAAA-MM.md`) a las 72 horas de cada publicación. Solo copia lo que muestra cada plataforma: no interpreta, no redondea y no calcula porcentajes.

## Formato

```markdown
| Fecha | Pieza | Plataforma | Vistas o impresiones | Reacciones | Comentarios | Guardados | Compartidos | Notas |
|---|---|---|---|---|---|---|---|---|
| 12/10 | 2026-10-12-agente-sin-tests | LinkedIn | 1234 | 56 | 7 | — | 3 | Preguntaron por los tests |
```

- **Encuestas:** los votos de cada opción, en "Notas".
- **Pedidos repetidos** en los comentarios (skills, temas): en "Notas", y se suman a `../ideas.md`.
- **Problemas al publicar** (un archivo que no subió, un aviso de la plataforma): en "Notas", con la hora.

## Para qué se usa

Al planificar el mes siguiente, Claude o Gemini miran:
- qué ramas y formatos se guardaron y comentaron más;
- qué preguntas se repitieron.

Esto no se publica ni se convierte en "resultados": es para decidir qué hacer después.
