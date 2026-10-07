# Dossier · L&B Elite Wash & Detail

Fuente: repositorio del cliente `LyB Elite Wash Details` (en el espacio de trabajo). Todo lo detallado a continuación fue verificado directamente contra `site/DISENO-SIN-BASE-DE-DATOS.md`, `site/AGENDA.md`, `site/MEMBERSHIPS.md`, `site/PANORAMA.md`, `site/script.js` y `site/cuadrilla.html`.

---

## 1. Qué es
- **L&B Elite Wash & Detail**: servicio de detailing y lavado profesional a domicilio en el suroeste de Florida (Fort Myers, Cape Coral, Naples y zonas aledañas).
- **Flota operativa**: **4 camionetas equipadas** con generadores, compresores y tanques de agua autónomos para operar en cualquier entrada de garage o propiedad.
- **Categorías atendidas**: autos y SUVs, camionetas y vans, motocicletas, embarcaciones marinas (botes, jet skis), casas rodantes (RVs) y vehículos pesados.
- **Catálogo real verificado**: **88 productos y 142 precios** estructurados por tipo de carrocería y paquete (desde lavado exterior básico hasta corrección de pintura cerámica y restauración profunda).
- **Sitio y webapp**: cotizador interactivo por pasos (`index.html` + `script.js`), app móvil para personal de campo (`cuadrilla.html`) y portal de autogestión de miembros (`mi-membresia.html`).

---

## 2. El Principio Rector Operativo
**"Una visita es UNA camioneta en UNA casa, atendiendo los vehículos en secuencia."**

1. **Duraciones acumulativas**: la cuadrilla viaja una sola vez al domicilio del cliente. Tres sedanes no son tres camionetas simultáneas: son 60 + 60 + 60 minutos de labor más un único buffer de traslado al final (visita total de **3h30**).
2. **Buffer de traslado cobrado una sola vez**: no existe tiempo de viaje entre autos estacionados en la misma entrada de garage. En carritos mixtos se aplica el buffer mayor de las categorías seleccionadas.
3. **Disponibilidad atómica de visita**: un horario solo se ofrece si **una misma camioneta está libre durante la totalidad de la visita**. Una camioneta libre para los dos primeros autos pero ocupada en el tercero queda descartada; no se puede dividir la cuadrilla a mitad del servicio.
4. **Límite operativo por reserva**: máximo **4 vehículos** estándar por turno (4×60 min + 30 min traslado = 4h30) o **2 vehículos** si el pedido incluye trabajos náuticos (botes o jet skis, a 2h cada uno). Pedidos mayores reciben HTTP 422 para cotización manual.
5. **Capacidad del sistema**: 4 camionetas implican **4 domicilios en simultáneo**, no cuatro autos.

---

## 3. Arquitectura "Database-less" (Cero Postgres)
Diseñada e implementada en agosto de 2026. Se eliminó por completo PostgreSQL del repositorio (cero drivers, cero migraciones, cero latencia ni desincronización entre bases de datos y CRM).

### El CRM (GoHighLevel) como Único Almacén de Estado
Todo el estado de la reserva, cliente, venta y facturación vive en 4 objetos nativos de GoHighLevel:

| Entidad | Objeto en HighLevel | Reemplaza en DB tradicional |
|---|---|---|
| **Reserva y Turno** | Cita (*Appointment*) en el calendario de la camioneta | `bookings`, `booking_assignments`, `booking_holds` |
| **Cliente** | Contacto (*Contact*) validado con dirección y teléfono | `customers`, `profiles` |
| **Venta comercial** | Oportunidad (*Opportunity*) en pipeline comercial | `orders`, `deals` |
| **Cobro / Depósito** | Factura (*Invoice*) con webhook de pago | `payment_events`, `ledger` |

### Máquina de Estados Nativa (`appointmentStatus`)
El hold temporal y la reserva confirmada son el **mismo objeto** con diferente estado:
```
new        → reservado, esperando pago (hold temporal de 15 minutos)
confirmed  → pagado (confirmado vía webhook verificado)
showed     → servicio entregado en la casa (marcado por la cuadrilla en campo)
noshow     → el cliente no estaba presente (consume el crédito / retiene depósito)
cancelled  → cancelado y ventana liberada
```

### Serialización de Contrato en la Cita
La descripción de la cita almacena pares clave-valor separados por `·`:
- `key:` y `expira:` para control de vencimiento y limpieza.
- `Idempotency-Key:` para repeticiones seguras de petición.
- `veh:`, `orden:`, `total:`, `deposito:` leídos directamente por la app de la cuadrilla.

---

## 4. Concurrencia y Balanceo de Carga

1. **Arbitraje por HighLevel**:
   - Al intentar crear una cita sobre una ventana ya tomada por otro usuario, HighLevel responde de forma determinista `400 "The slot you have selected is no longer available."`.
   - De múltiples peticiones concurrentes idénticas gana exactamente una.
2. **Fallback sin pérdida de cliente**:
   - Si una camioneta pierde la carrera por concurrencia, el backend **no cancela la petición**: marca esa camioneta como ocupada en esa pasada y prueba automáticamente la siguiente camioneta disponible (hasta 4 camionetas).
3. **Rotación determinista**:
   - El cursor de la camioneta inicial se deriva contando cuántas visitas ya existen en los calendarios de ese día (`visitas_del_día % 4`). Las reservas se distribuyen equilibradamente entre las 4 unidades.
4. **Expiración Lazy**:
   - Las citas en estado `new` con tiempo de hold expirado se consideran libres inmediatamente en la consulta de disponibilidad y son eliminadas al paso durante la siguiente reserva o por un cron diario de limpieza.

---

## 5. Operación en Campo: La App de la Cuadrilla (`cuadrilla.html`)

- **Diseño ergonómico**: interfaz móvil táctil con botones de gran tamaño diseñada específicamente para **uso con una sola mano, en exteriores y con manos húmedas**.
- **Acceso seguro sin cookies**: enlace firmado `/c/<token>` sin almacenamiento local sensible en teléfonos compartidos.
- **Acciones principales**:
  - `Atendida` (`.attend` verde): marca el servicio como entregado (`showed`).
  - `Cobré efectivo` (`.cash` azul): registra cobro manual en campo con sugerencia del saldo pendiente.
  - `Link de pago` (`.link` violeta): despacha enlace SMS de cobro para tarjetas.
  - `No estaba` (`.noshow` ámbar): registra ausencia del cliente sin perder el costo del traslado.
  - `Cancelar` (`.cancel` secundario): resguardado para evitar toques accidentales.

---

## 6. Identidad Visual y Paleta de Marca

- **Colores de marca** (de `site/styles.css`):
  - Acento principal (Azul Eléctrico / Zafiro): `#1E6FE6`
  - Acento brillante: `#4A9AFF`
  - Acento profundo: `#1659C7`
  - Glow azul: `rgba(30, 111, 230, 0.25)`
  - Fondo oscuro / Midnight Dark: `#06080D`
  - Superficie / Glass: `#0D1423` (borde `rgba(255, 255, 255, 0.08)`)
  - Texto principal: `#F5F8FC`, texto secundario `#9BA7B4`
- **Tipografía**:
  - Display / Títulos: `Outfit`, sans-serif
  - Body & UI: `Inter`, sans-serif
- **Personalidad**: Detailing de élite, precisión técnica, estética oscura con reflejos cerámicos en azul eléctrico.

---

## 7. Beats de la Cinemática (Estructura Propia y Distintiva)

Para que el film no se sienta como una plantilla de New Brothers o Fénix:

1. **Beat 0 — Identidad y Flota (0 a 12 s)**:
   - Formación del isotipo circular de L&B en partículas azul eléctrico.
   - Titular: "Detailing móvil de alta gama en tu propia entrada".
   - Despliegue de la flota: **4 camionetas autónomas** patrullando el suroeste de Florida.
2. **Beat 1 — La Regla Operativa: "Una visita, una camioneta" (12 a 26 s)**:
   - Visualización de la entrada de garage: cómo 1, 2 o 3 autos se encadenan en una sola camioneta sin traslados intermedios.
   - Cálculo del buffer acumulativo (60 + 60 + buffer = 2h30).
3. **Beat 2 — Cotizador Dinámico por Tipo de Vehículo (26 a 44 s)**:
   - Escena interactiva: selector de carrocería (Sedan, SUV, Truck, Bote).
   - Ajuste dinámico de precios y paquetes reales (88 servicios, 142 precios).
4. **Beat 3 — Arquitectura "Database-less" sobre HighLevel (44 a 62 s)**:
   - Diagrama Archify del caso: el navegador valida $\rightarrow$ ruteo a 4 calendarios de camioneta $\rightarrow$ máquina de estados `appointmentStatus` (`new` $\rightarrow$ `confirmed` $\rightarrow$ `showed`) $\rightarrow$ cero Postgres.
   - Concurrencia tolerante a fallos: rotación inteligente entre camionetas.
5. **Beat 4 — La Cuadrilla en Campo y Cierre (62 a 75 s)**:
   - Simulación del panel táctil de la cuadrilla (`cuadrilla.html`): resolución de paradas en un toque (atendida / cobro / entrega).
   - Cierre con monograma de L&B y métricas verificadas de ingeniería.
