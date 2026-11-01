# Entrega Crítica T01 & T02 · Héroe, Servicios y Contacto

- **Tarea:** Crítica externa del héroe, servicios y contacto nuevos (apoyo a T01 y T02).
- **Dueño:** Gemini
- **Estado:** Para revisar
- **Fecha:** 1 de noviembre de 2026

---

## 1. Qué se hizo
- Se realizó una crítica a ciegas (sin consultar `T01.md`) evaluando la preview en vivo (`http://localhost:3011`) y el código integrado en `triada/web`.
- Se analizó el contenido poniéndose en el lugar de 3 perfiles de visitantes:
  1. Dueño de negocio sin equipo técnico.
  2. Reclutador que busca "AI Automation".
  3. Colega desarrollador.
- Se clasificó cada texto como `persona`, `plantilla` o `relleno`.
- Se proporcionó una reescritura en español neutro con tuteo (sin voseo) para cada texto con oportunidad de mejora.
- Se identificaron los 4 frenos que impiden que un visitante escriba en la primera pantalla.

## 2. Dónde quedó
- Documento principal: `web/docs/triada/gemini/critica-T01-T02.md`

## 3. Principales recomendaciones
1. Resolver la contradicción del héroe: "coordino personas" vs "lo construyo yo".
2. Reemplazar "Orquesto la tecnología" por un beneficio más concreto ("Diseño y automatizo los sistemas...").
3. Solucionar el riesgo del enlace `mailto:` en "Consultar por un puesto" con un botón de fallback para ver el CV o copiar el correo.
4. Dar una referencia orientativa de precio o entrada ("desde USD X" o "diagnóstico en 15 min") para eliminar el miedo a consultar.
