# Dossier · Mr. Studio Tattoo

> **Estado:** verificado el 2026-10-07 contra la **versión publicada** en `https://www.mrstudiotattoo.com`.
> - Recorrido en solo lectura con datos de ejemplo hasta el paso 7: el navegador bloqueó toda escritura (POST) y toda llamada a CRM o pagos.
> - Los pasos 8 a 10 se verificaron con los textos del paquete JavaScript público.
>
> **Cliente:** Mr. Studio Tattoo, estudio de tatuajes en La Pequeña Habana, Miami.

---

## 0. Qué versión cuenta

- **Hay dos versiones.**
  - **Publicada:** azul, tipografía Anton.
  - **Repos locales** (`Desktop/MrTatto`, `temp_mrtattoo`, `temp_mrtattooo`; GitHub `Marser321/mrstudiotattoo(o)`): roja (`#DC2626`) con Playfair Display.
- Mario eligió la **versión publicada** para el film y para el caso. La roja no se usa.
- **Correcciones a la versión anterior de este dossier:**
  - La marca no es "menta `#71F3A2`": ese es el color del propio portfolio.
  - El cobro de seña existe en el flujo publicado (ver § 2), pero no como "retainer" previo a elegir la zona.

## 1. Identidad (CSS servido)

- **Fondo y superficies:**
  - Fondo `#07090f`.
  - Tarjetas `#151a28`.
  - Elevado `#1e2435`.
  - Bordes `#2a3142`.
- **Texto:** `#e8edf6`; secundario `#9ba7ba`.
- **Acento:** `--primary #2a4de8` y `--ring #1744fa`.
- **Tipografía:** Anton (títulos) e Inter (texto).
- **Logo:** monograma "MR" con una máquina de tatuar (`public/assets/logo.png` en los repos, mismo logo en ambas versiones).
- **Ubicación:** "MR Studio Tattoo nace en el corazón de La Pequeña Habana" (sitio); el archivo `.ics` dice "MR Studio Tattoo, Miami, FL".

## 2. La reserva publicada (`/booking`)

**10 pasos** ("Paso 1 de 10"; el sitio dice "Toma menos de 3 minutos"):

1. **Fecha de nacimiento:** calcula la edad y la muestra ("Perfecto, tienes 31 años · podemos continuar").
2. **Servicio:** 2 opciones, Tatuaje o Piercing.
3. **Artista:** 6 artistas con sus años de oficio:
   - Misael Ink, 6+
   - Tony 'El Verdugo', 7+
   - Annaliet, 5+
   - Alejandro, 6+
   - Ramsés 'El Faraón', 8+
   - Khris, 5+
4. **Tamaño:** 3 opciones:
   - Chico: menos de 8 cm, ~1 h.
   - Mediano: 8–15 cm, ~2–3 h.
   - Grande: más de 15 cm o varias sesiones, 4 h+.
5. **Zona del cuerpo:**
   - Figura anatómica con vista de frente y de espalda y selección múltiple.
   - Vista de frente: 24 zonas tocables (lista accesible: cabeza, cuello, pecho, abdomen y 10 pares izquierda/derecha).
   - Las zonas son `path` con ids de grupos musculares (`forearm`, `biceps`, `abs`…), propios de una librería abierta de cuerpo anatómico. El film usa capturas; no copia el SVG.
6. **Estilo y concepto:** descripción de la idea e imagen de referencia opcional (JPG, PNG o WEBP, máx. 10 MB).
7. **Tus datos:** nombre, teléfono y email. El recorrido del film se detuvo acá.
8. **Fecha y hora:** "Elige el día y la hora directamente con el artista. El depósito se cobra al confirmar." El calendario embebido se titula "Agenda y confirma tu depósito".
9. **Consentimiento:**
   - **Adultos:** "Aceptado digitalmente", "Firmado como: {nombre}".
   - **Menores:**
     - Requieren consentimiento notarizado, que se sube o se trae impreso.
     - Datos del tutor; el tutor debe estar presente durante toda la sesión.
     - La reserva queda "pendiente de verificación del consentimiento notarizado".
   - Son 2 caminos de consentimiento.
10. **Revisa y confirma:**
    - Adulto: "Cita confirmada", archivo `.ics` y WhatsApp.
    - Menor: "Solicitud recibida".

**Idiomas:** español e inglés (2), con selector ES/EN.

## 3. Cifras del film (todas de la versión publicada)

- 10 pasos de reserva.
- 6 artistas.
- 24 zonas en la vista de frente.
- 3 tamaños.
- 2 servicios.
- 2 caminos de consentimiento.
- 2 idiomas.
- 8+ años, el máximo de oficio entre los artistas.

## 4. Material del film

- **Capturas** con `scripts/capture-film-flows.ts mr-live-booking`, a 2× (1920×2200): `shots/live-1-edad` a `live-6-concepto`, incluida la zona de frente, con el antebrazo marcado y de espalda.
  - Recortes: `*-paso.jpg` (sin el vacío de abajo) y `artistas.jpg` (la grilla del paso 3).
- **Clip:** `hero-rosa.mp4/.webm` (720×1280, 11,3 s), cuadros 230–569 de `public/assets/hero-sequence-v4` de los repos. Es metraje del estudio: una rosa realista tatuada en un antebrazo.
- **No usar:**
  - montos del depósito (no se ven en el recorrido permitido);
  - testimonios;
  - la versión roja.
