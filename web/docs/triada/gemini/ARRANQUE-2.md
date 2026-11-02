# Arranque de Gemini · sesión 2 (1/11/2026)

Pegar en Antigravity, con la carpeta MMORERA abierta, **después** del prompt fijo `web/docs/triada/PROMPT-gemini.md`.

---

Gracias por T03, T12 y la crítica: quedaron integradas en `web/docs/triada/PLAN-experiencia.md`, sección 10. Mario aprobó ese plan.

Tienes 2 tarjetas y una crítica condicional, en este orden. Están en `web/docs/triada/TABLERO.md`.

**Voz:** escribe tus informes en **español neutro con tuteo**, sin voseo (nada de «vos», «podés» ni «querés»). Es la misma voz del sitio.

## 1. T28 · Verificar las rutas «Pruébalo tú»

Cada caso de portada va a tener botones que llevan al visitante a probar el sistema real. Antes de ponerlos, hay que confirmar que funcionan para cualquiera y que no muestran datos de clientes reales.

**Rutas a revisar** (salen de tu T03):

| Caso | Ruta | Qué se quiere mostrar |
|---|---|---|
| L&B | `https://l-b-five.vercel.app/#quoter` | El cotizador por vehículo |
| L&B | `https://l-b-five.vercel.app/cuadrilla` | La app de la cuadrilla. **Confirma si abre sin `?t=<token>`** y qué ve alguien que entra sin token |
| New Brothers | `https://nb-barber.vercel.app/reservar` | La reserva en 6 pasos |
| New Brothers | `https://nb-barber.vercel.app/admin-login` → «Entrar directo al CRM demo» | El CRM demo |
| New Brothers | `https://nb-barber.vercel.app/admin/asistente` | El asistente con base de conocimiento |
| Fenix | `https://fenixmedicalcenters.com/es/contacto` y su par en inglés | El formulario sin texto libre |

**Para cada ruta:**
- ¿Abre sin cuenta propia?
- ¿Muestra **nombres, teléfonos, emails o montos de clientes reales**? Si son datos de demo, ¿se nota que lo son?
- Qué ve el visitante, en una línea: es la base del texto del botón.
- Cómo se ve a 390 px.
- Una captura.
- Tu marca: **«abre»**, **«Demo»** (abre, con datos de muestra) o **«no usar»**.

**Muy importante:**
- **No confirmes ninguna reserva, no envíes ningún formulario y no inicies pagos.** Son negocios reales: llega hasta el paso anterior a confirmar.
- Si una pantalla del CRM demo muestra lo que parecen datos reales de personas, **no la captures entera**: anótalo y recorta.

**Salida:** `web/docs/triada/gemini/T28-pruebalo.md` y las capturas en `web/docs/triada/gemini/T28/`. Nota en `web/docs/triada/entregas/T28.md`.

## 2. T34 · Prueba de 5 segundos (antes de la Fase A)

Vamos a acortar el home. Para saber si se entiende mejor, primero hay que medir cómo se entiende **hoy**. Mario consigue entre 3 y 4 personas:
- 1 o 2 dueños de negocio sin equipo técnico;
- 1 persona de una empresa que contrata perfiles de *AI Automation*;
- 1 colega dev o de una agencia.

Tú preparas todo lo demás.

**Preparación:**
- **Capturas:** levanta la preview de `triada/web` en `http://localhost:3012` (si no está arriba, pídesela a Mario) y captura:
  - la primera pantalla a 1440 px;
  - la primera pantalla a 390 px;
  - el home completo a 390 px.

  En ES. Si alguna persona lo prefiere, también en EN. Así la prueba se puede hacer con imágenes, sin que nadie entre a localhost.
- **Guion para Mario:**
  1. Muestra la primera pantalla 5 segundos y escóndela.
  2. Pregunta: «¿Qué hace esta persona?», «¿Para quién lo hace?» y «Si te interesara, ¿qué harías ahora?».
  3. Muestra el home completo, 2 minutos para recorrerlo.
  4. Pregunta: «¿Qué te quedó?», «¿Qué te sobró o te cansó?» y «¿Qué no entendiste?».
- **Ficha por persona:** audiencia, respuestas textuales (sin nombre ni datos de contacto) y la duración.
- **Consentimiento:** una línea que Mario lee antes de empezar. Por ejemplo: «Es para mejorar mi web; anoto lo que digas sin tu nombre».

**Salida:** `web/docs/triada/gemini/T34-prueba.md` (guion, fichas vacías y dónde están las capturas) y las capturas en `web/docs/triada/gemini/T34/`. Cuando Mario te pase las respuestas, las consolidas en el mismo archivo: qué entendió cada audiencia y qué no.

## 3. Crítica de la preview (cuando Codex entregue T22)

Cuando T22 esté en `para revisar`, lee la preview **sin leer el plan ni el brief**, como en tu primera crítica. Marca:
- qué se entiende más rápido;
- qué se perdió;
- dónde el home sigue abrumando.

**Salida:** `web/docs/triada/gemini/critica-T22.md`.

**Recordatorios:** no toques `web/src/`, no hagas commits en `main` y no inventes cifras. En el tablero, cambia solo el estado de tus tarjetas.
