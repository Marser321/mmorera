# Registro de visitas a /demos

Cada socio o campaña recibe su enlace con `?de=`:

- `https://mmorera.agency/demos?de=indigo`
- `https://mmorera.agency/demos/gimnasios?de=campana-ig`

El valor tiene que ser un slug corto (minúsculas, números y guiones, hasta 32 caracteres). Si no cumple, se ignora.

## Qué se registra

La página avisa a `/api/visita` con `sendBeacon`, sin cookies y sin guardar la IP. Los eventos son:

| Evento | Cuándo | Detalle |
|---|---|---|
| `vista` | Al abrir `/demos` o una página de rubro | — |
| `demo` | Al entrar a la demo embebida | — |
| `escena` | Al elegir una escena | `panel`, `socio`, `entrenador` o `web` |
| `contacto` | Al tocar WhatsApp o el brief | `whatsapp` o `brief` |

El origen se guarda en `sessionStorage`, así que acompaña a la visita mientras la pestaña siga abierta:

- de la portada a cada rubro;
- en el mensaje de WhatsApp, que ya dice «vengo de parte de …»;
- en el brief (`/aplicar`), donde el lead llega con `source = website:<origen>` y una línea «Viene de» en el correo y en Telegram.

## Dónde se ve

1. **Registros de Vercel:** en cada visita queda una línea `{"tipo":"visita-demo",…}`.
2. **Telegram:** el bot de los leads avisa cuando llega una visita con origen y cuando esa visita pide contacto. Las visitas sin origen no avisan.
3. **n8n → base `ventas` del VPS:** cada visita con origen se reenvía por POST a `https://n8n.smorera.tech/webhook/visita-demo` (workflow «Visitas · Demo»), con el JSON `{pagina, evento, de, detalle}` y el encabezado `X-Visita-Token`. n8n la guarda en la tabla `demo_visitas` y la vista `envios_visitas` la cruza con los envíos por `envios.slug` (vistas, entró a la demo, pidió contacto, primera y última visita). Cuando la visita coincide con un envío, n8n avisa por Telegram con el nombre del negocio: en la primera vista y en cada pedido de contacto.
   - Variable de entorno en Vercel: `VISITAS_WEBHOOK_TOKEN` (solo servidor, sin `NEXT_PUBLIC_`). El valor es el de la credencial «Visitas demo (token de la web)» de n8n; en la Mac está en `~/.config/servidor/visitas-demo-token`. Nunca va al repo.
   - Si la variable falta, no se manda nada. Si n8n falla o tarda más de 3 s, se ignora y la visita sigue igual.
   - Las visitas sin origen no se reenvían: no hay envío con qué cruzarlas.
   - Para verlas (en la Mac): `ssh vps "docker exec n8n-postgres-1 psql -U n8n -d ventas -c 'select nombre, slug, vistas, entro_demo, pidio_contacto, ultima_visita from envios_visitas where vistas > 0 order by ultima_visita desc'"`.
4. **InsForge:** se guarda en la tabla `demo_visitas` si existe. Todavía no está creada; mientras falte, el error se ignora. Para crearla:

```sql
create table if not exists demo_visitas (
  id bigint generated always as identity primary key,
  creado timestamptz not null default now(),
  pagina text not null,
  evento text not null,
  origen text,
  detalle text
);
alter table demo_visitas enable row level security;
-- La web escribe con la clave anónima; leer queda para el panel de InsForge.
create policy "la web registra visitas" on demo_visitas for insert to anon with check (true);
```

Para ver las visitas por socio:

```sql
select origen, evento, count(*) from demo_visitas group by 1, 2 order by 1, 2;
```

## Enlaces personales sin `?de=` (desde el 23/11/2026)

Los `?de=` en la dirección se ven raros en un primer contacto. Para mandar a un negocio, se usa la ruta limpia:

- Gimnasios y estudios: `https://mmorera.agency/demo/<negocio>`, por ejemplo `/demo/city-fitness`. Abre la demo de gimnasios con «Preparada para City Fitness», y la vista previa del enlace dice «Demo para City Fitness».
- Oficio: `https://mmorera.agency/oficio/<negocio>`, por ejemplo `/oficio/la-barberia`. Muestra el caso de Oficio y la vista previa dice «Oficio para La Barbería».

El `<negocio>` es el mismo slug de siempre (minúsculas, números y guiones, hasta 32). La visita se registra con ese origen, igual que con `?de=`: en Oficio con `pagina = /demos/oficio`. Las dos rutas quedan fuera de los buscadores. `/demo` y `/oficio` solos redirigen a la demo de gimnasios y al caso de Oficio. Los `?de=` viejos siguen funcionando.
