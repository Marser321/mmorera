# Implementation Plan

<implementation_scope>
  <primary_workspace>/Users/mariomorera/Desktop/MMORERA</primary_workspace>
  <primary_app>/Users/mariomorera/Desktop/MMORERA/web</primary_app>
  <goal>Ejecutar la app en local, observarla en vivo y aplicar refinamientos visuales, de UX y de calidad sin tocar cambios ajenos innecesarios.</goal>
</implementation_scope>

<current_context>
  <finding>El workspace contiene dos apps Next.js, pero `web` parece ser la app activa: tiene rutas, componentes de secciones, InsForge SDK y cambios recientes en git.</finding>
  <finding>El repo ya tiene cambios sin commitear. Cualquier ajuste debe ser quirurgico y respetar el trabajo existente.</finding>
  <finding>La home actual renderiza `HeroSection`, `PhilosophySection`, `TrustedByStrip` y `FAQSection`, con layout global, navbar, footer, fondo y chatbot.</finding>
</current_context>

<work_phases>
  <phase name="1_local_run">
    <what>Instalar/verificar dependencias si hace falta y levantar `npm run dev` en `web`.</what>
    <why>Necesitamos ver la experiencia real, no solo leer componentes aislados.</why>
    <business_benefit>Permite detectar fricciones que afectan conversion, confianza y percepcion premium antes de invertir en cambios mas grandes.</business_benefit>
  </phase>
  <phase name="2_live_audit">
    <what>Abrir la app en navegador local, revisar consola, responsive desktop/mobile, primer viewport, navegacion, CTA, legibilidad y jerarquia visual.</what>
    <why>El refinamiento visual se decide mejor con evidencia: capturas, errores reales y comportamiento interactivo.</why>
    <business_benefit>Mejora claridad comercial, reduce abandono y refuerza la propuesta de MMorera como sistema B2B serio, no solo pagina estetica.</business_benefit>
  </phase>
  <phase name="3_targeted_refinement">
    <what>Aplicar cambios acotados en componentes y estilos con foco en calidad de landing/app: hero, navbar, secciones clave, estados responsive y microinteracciones.</what>
    <why>Los cambios pequenos pero bien elegidos suelen elevar la conversion sin introducir deuda ni romper flujos.</why>
    <business_benefit>Aumenta percepcion de autoridad, facilita que el visitante entienda la oferta y empuja a la accion comercial.</business_benefit>
  </phase>
  <phase name="4_validation">
    <what>Validar con lint/build/tests disponibles y una segunda pasada de navegador con capturas o inspeccion visual.</what>
    <why>Un refinamiento no esta terminado hasta comprobar que compila, no rompe interacciones y se ve bien en tamanos clave.</why>
    <business_benefit>Reduce riesgo operativo al entregar una version mas confiable para demo, venta o despliegue.</business_benefit>
  </phase>
</work_phases>

<guardrails>
  <security>No escribir secretos, API keys ni tokens en codigo o archivos versionados. Usar `.env` o variables de entorno si aparece alguna integracion que lo requiera.</security>
  <insforge>Si aparece trabajo nuevo de integracion InsForge, primero se debe obtener documentacion oficial actualizada mediante las herramientas MCP indicadas por el proyecto.</insforge>
  <git_hygiene>No revertir cambios existentes del usuario. Antes de finalizar, reportar exactamente que archivos se tocaron.</git_hygiene>
  <design_quality>No crear una pagina de marketing generica; refinar la experiencia real, con primer viewport fuerte, UI sobria, responsive y sin textos solapados.</design_quality>
</guardrails>

<approval_required>
  <status>waiting_for_vibe_approval</status>
  <request>Responder con aprobacion explicita para levantar el servidor local y empezar la fase de refinamiento en vivo.</request>
</approval_required>

<portfolio_cover_refinement>
  <status>waiting_for_vibe_approval</status>
  <trigger>Comentario en /portfolio sobre portadas no profesionales, especialmente AutoHub y Directorio Inmobiliario.</trigger>
  <finding>AutoHub esta usando primero `/portfolio/autohub-transparent.png`, una imagen 640x640 con apariencia de fondo transparente/checker que se ve poco profesional en una card 16:10.</finding>
  <finding>Directorio Inmobiliario usa `/portfolio/realstate-brown.png`; necesita una portada generada/curada con lenguaje de producto inmobiliario premium.</finding>
  <what>Generar nuevas portadas raster 16:10 para los proyectos con fondo incorrecto o debil, guardarlas en `web/public/portfolio/` con nombres versionados, y actualizar `portfolio-section.tsx` para usar esas portadas como imagen principal.</what>
  <why>El portfolio es prueba de autoridad. Si la primera card muestra un fondo improvisado, baja confianza incluso si el producto real es bueno.</why>
  <business_benefit>Portadas consistentes y premium aumentan percepcion de calidad, hacen mas vendible el catalogo de casos y reducen friccion antes del CTA o demo interactiva.</business_benefit>
  <validation>Revisar `/portfolio` en navegador desktop/mobile, confirmar que no haya fondos checker, overlays ilegibles, 404s ni cards visualmente rotas. Luego correr lint/build si se tocan archivos de codigo.</validation>
  <guardrails>
    <asset_policy>No sobrescribir assets existentes salvo instruccion explicita; crear archivos nuevos como `autohub-cover-v2.png` y `realstate-cover-v2.png`.</asset_policy>
    <professional_standard>Evitar fondos genericos, borrosos, stock-like o con texto falso ilegible. Las portadas deben parecer mockups premium de producto digital real.</professional_standard>
    <security>No incluir datos sensibles, marcas de terceros no autorizadas ni claims falsos dentro de las imagenes generadas.</security>
  </guardrails>
  <request>Responder con aprobacion explicita para generar los assets y actualizar el portfolio.</request>
</portfolio_cover_refinement>

<portfolio_project_removal>
  <status>waiting_for_vibe_approval</status>
  <trigger>Comentario en /portfolio sobre eliminar el proyecto `Gym CRM MVP`.</trigger>
  <scope>Editar solamente la fuente de datos del portfolio para que el proyecto deje de renderizarse en `/portfolio`.</scope>
  <what>Remover el objeto del proyecto `Gym CRM MVP` del arreglo `PROJECTS` en `web/src/components/sections/portfolio-section.tsx`.</what>
  <why>El portfolio debe mostrar solo casos que sostengan el estándar comercial actual. Si un proyecto ya no representa la calidad deseada, conviene quitarlo antes que retocarlo superficialmente.</why>
  <business_benefit>Mejora la curaduría del portfolio, reduce distracciones y mantiene la percepción premium de la oferta.</business_benefit>
  <validation>Recargar `/portfolio`, confirmar que `Gym CRM MVP` no aparece, que el grid no deja huecos visuales y correr `pnpm lint`/`pnpm build` si aplica.</validation>
  <guardrails>
    <atomicity>Una sola acción: remover el proyecto del portfolio. No borrar archivos de imagen ni modificar otros casos sin pedido explícito.</atomicity>
    <git_hygiene>No revertir cambios existentes del usuario ni limpiar assets no usados salvo confirmación específica.</git_hygiene>
  </guardrails>
  <request>Responder con aprobacion explicita para remover `Gym CRM MVP` del portfolio.</request>
</portfolio_project_removal>

<work_modes_section_rewrite>
  <status>waiting_for_vibe_approval</status>
  <trigger>Comentario en /portfolio sobre reemplazar la seccion de rubros por modalidades de trabajo mas abiertas.</trigger>
  <scope>Editar `web/src/components/sections/notebook-cases.tsx` para reemplazar la narrativa de verticales/rubros por 3 tarjetas de modos de trabajo.</scope>
  <what>Reescribir encabezado, bajada, tarjetas y CTA final con menos texto: proyecto puntual cotizado, integracion full time sujeta a disponibilidad, e integracion part time/fractional.</what>
  <why>La pagina debe abrir oportunidades y no encasillar la oferta en demasiados rubros especificos.</why>
  <business_benefit>Hace mas facil que empresas con necesidades distintas entiendan como contratarte sin sentirse fuera de una lista cerrada de industrias.</business_benefit>
  <validation>Recargar `/portfolio`, confirmar que la seccion muestra solo 3 tarjetas claras, sin overflow ni exceso de texto, y correr lint/build.</validation>
  <guardrails>
    <atomicity>Una sola tarea: reescribir la seccion de modalidades. No tocar portfolio cards ni otras secciones.</atomicity>
    <copy_tone>Texto corto, abierto y comercial. Evitar promesas cerradas hasta que el usuario desarrolle mejor cada modalidad.</copy_tone>
  </guardrails>
  <request>Responder con aprobacion explicita para reescribir la seccion.</request>
</work_modes_section_rewrite>

<problem_solution_section_fix>
  <status>waiting_for_vibe_approval</status>
  <trigger>Comentario en `/servicios`: la seccion `Alerta: Fuga de Ingresos` no integra bien el efecto en ningun dispositivo.</trigger>
  <scope>Editar `web/src/components/sections/problem-solution.tsx` para sustituir el reveal sticky/clip-path por una composicion estable y responsive.</scope>
  <finding>La implementacion actual usa `useScroll`, `clip-path`, sticky y dos capas de 100dvh dentro de un contenedor de 160dvh. En desktop el efecto depende demasiado del scroll; en mobile se vuelve una doble pantalla apilada y pesada.</finding>
  <what>Convertir la seccion en un bloque compacto con dos paneles comparativos: problema comercial y sistema solucion, manteniendo dramatismo visual con glow, iconos y metricas, pero sin reveal que rompa layout.</what>
  <why>La narrativa debe entenderse inmediatamente en cualquier viewport. El efecto no puede competir con el mensaje ni crear saltos raros de scroll.</why>
  <business_benefit>Mejora legibilidad de la oferta, baja friccion en la pagina de servicios y hace que la promesa de automatizacion se perciba mas profesional.</business_benefit>
  <validation>Verificar `/servicios` en desktop y mobile, sin solapamientos, sin 100dvh excesivo, sin overflow horizontal, sin errores de consola. Correr lint/build.</validation>
  <guardrails>
    <atomicity>Una sola tarea: resolver esta seccion. No tocar pricing, catalogo o contacto.</atomicity>
    <design_quality>Usar menos texto visible, tarjetas sobrias y estados claros. Evitar efectos dependientes de scroll complejo.</design_quality>
  </guardrails>
  <request>Responder con aprobacion explicita para implementar el rediseño de esta seccion.</request>
</problem_solution_section_fix>

<portfolio_filter_bar_removal>
  <status>waiting_for_vibe_approval</status>
  <trigger>Comentario en `/portfolio`: quitar la barra de filtrado `Todos / E-commerce / Sistemas / Agencias / Real Estate / Clinicas`.</trigger>
  <scope>Editar `web/src/components/sections/portfolio-section.tsx` para remover UI y estado de filtrado.</scope>
  <what>Eliminar `CATEGORIES`, `activeCategory`, `filteredProjects` y el bloque visual de filtros; renderizar directamente `PROJECTS`.</what>
  <why>La barra agrega friccion y ruido visual si el portfolio debe leerse como una seleccion curada completa.</why>
  <business_benefit>La pagina queda mas editorial, directa y enfocada en los casos, sin forzar al usuario a segmentar antes de explorar.</business_benefit>
  <validation>Recargar `/portfolio`, confirmar que la barra no aparece, que todos los proyectos siguen visibles y que no hay errores. Correr lint/build.</validation>
  <guardrails>
    <atomicity>Solo quitar la barra y la logica asociada. No reordenar proyectos ni cambiar cards.</atomicity>
  </guardrails>
  <request>Responder con aprobacion explicita para remover la barra de filtros.</request>
</portfolio_filter_bar_removal>

<live_refinement_session_2026_05_19>
  <status>waiting_for_vibe_approval</status>
  <trigger>Pedido: ejecutar en local para seguir refinando la pagina abierta.</trigger>
  <current_state>Servidor local activo en `http://localhost:3000` usando `pnpm dev`.</current_state>
  <finding>La ruta anterior `/portfolio` ahora devuelve 404; la pagina de casos/portfolio esta en `/casos-de-exito` y servicios esta en `/sistemas`.</finding>
  <active_page>http://localhost:3000/casos-de-exito</active_page>
  <what>Hacer una pasada de refinamiento visual en vivo sobre la pagina activa: revisar primer viewport, copy, espaciado, cards, navegacion inferior, mobile/desktop y errores de consola antes de aplicar cambios puntuales.</what>
  <why>El proyecto cambio rutas y contenido; antes de seguir editando conviene trabajar sobre la URL real y validar en navegador.</why>
  <business_benefit>Permite sostener una experiencia premium consistente y evitar cambios aislados que mejoran una parte pero rompen otra.</business_benefit>
  <validation>Para cada cambio: recargar la URL correcta, capturar desktop/mobile, verificar sin 404/overlay/overflow, y correr lint/build cuando se toque codigo.</validation>
  <guardrails>
    <atomicity>Trabajar una mejora por vez, con aprobacion por bloque cuando el cambio no sea trivial.</atomicity>
    <route_awareness>No usar `/portfolio` ni `/servicios` si no existen; usar `/casos-de-exito` y `/sistemas` segun la estructura actual.</route_awareness>
    <git_hygiene>No revertir cambios existentes ni borrar archivos no relacionados.</git_hygiene>
  </guardrails>
  <request>Responder con aprobacion explicita para empezar la auditoria visual y aplicar el primer refinamiento puntual.</request>
</live_refinement_session_2026_05_19>

<home_philosophy_personal_rewrite>
  <status>implemented_validated</status>
  <trigger>Comentario en home `/`: la seccion `Nuestra Filosofia` tiene demasiado texto y necesita un enfoque mas personal.</trigger>
  <scope>Editar `web/src/components/sections/PhilosophySection.tsx`.</scope>
  <finding>La seccion actual comunica como agencia/plataforma: transformacion digital, escala global, servicio presencial y transparencia. El texto es extenso, institucional y diluye el posicionamiento personal que el usuario quiere reforzar.</finding>
  <what>Reescribir la seccion con menos texto y una narrativa mas personal: profesional versatil y comprometido, enfoque generalista, pensamiento lateral y conexion entre administracion, marketing y ventas.</what>
  <why>La home debe vender confianza rapidamente. Una historia mas directa y humana explica por que trabajar con una persona capaz de mirar el negocio completo puede generar mejores soluciones que contratar piezas aisladas.</why>
  <business_benefit>Refuerza diferenciacion, autoridad consultiva y capacidad de integracion. Ayuda a que potenciales clientes entiendan que el valor no esta solo en programar, sino en encontrar palancas reales de operacion, captacion y conversion.</business_benefit>
  <proposed_structure>
    <headline>Reemplazar el titular institucional por uno centrado en versatilidad, criterio y soluciones conectadas.</headline>
    <body>Reducir parrafos largos a una bajada breve en primera persona profesional.</body>
    <cards>Agregar o reconvertir el bloque derecho en tres capas claras: Administracion, Marketing y Ventas.</cards>
    <cta>Mantener un CTA simple hacia contacto/aplicacion sin agregar instrucciones visibles innecesarias.</cta>
  </proposed_structure>
  <validation>Home `/` recargada en navegador local; se confirmo el nuevo titular, desaparicion del titular anterior y ausencia de overflow horizontal en desktop. `pnpm build` paso correctamente. `pnpm lint` queda bloqueado por un error preexistente en `web/src/app/aplicar/page.tsx` sobre usar `Link` en lugar de `<a>` para navegar a `/`.</validation>
  <guardrails>
    <atomicity>Solo trabajar esta seccion de home. No tocar navbar, hero, footer ni rutas.</atomicity>
    <copy_tone>Personal, sobrio y comercial. Evitar claims grandilocuentes o lenguaje de agencia generica.</copy_tone>
    <design_quality>Menos densidad, mejor escaneo, tarjetas compactas y texto que respire sin perder profundidad.</design_quality>
  </guardrails>
  <request>Responder con aprobacion explicita para reescribir `PhilosophySection.tsx`.</request>
</home_philosophy_personal_rewrite>

<systems_crm_ghl_redesign>
  <status>implemented_validated</status>
  <trigger>Pedido aprobado: redisenar `/sistemas` alrededor de CRM, GoHighLevel y automatizaciones conectadas.</trigger>
  <scope>Actualizar la narrativa principal de `web/src/app/sistemas/page.tsx`, crear animaciones reutilizables en `web/src/components/animations/`, y ajustar copy comercial en los modulos de servicios existentes.</scope>
  <what>Convertir la pagina de sistemas en una explicacion visual de CRM operativo: GHL como nucleo, flujos conectados, escalas de uso desde freelancer hasta operacion grande, y servicios orbitando alrededor del CRM.</what>
  <why>El CRM es una pieza de alto valor comercial porque conecta captacion, seguimiento, agenda, ventas, reporting y automatizacion en un sistema comprensible para clientes de distintos tamanos.</why>
  <business_benefit>Sube la percepcion de especializacion, hace tangible el valor de GHL/CRM y permite vender sistemas completos en lugar de servicios aislados.</business_benefit>
  <implementation_notes>
    <animation_stack>Usar Framer Motion + SVG controlado; no usar ReactFlow para la pieza principal.</animation_stack>
    <responsive>Desktop con nodos conectados amplios; mobile con flujo vertical sin cruces ni textos minimos.</responsive>
    <integration_boundary>No conectar APIs reales de GoHighLevel en esta iteracion.</integration_boundary>
  </implementation_notes>
  <validation>`/sistemas` verificada en navegador local: hero CRM/GHL, nodos orbitales, escalas y flujo conectado presentes; sin overflow horizontal en desktop. Chrome mobile 390px confirmo hero, GHL, escalas, flujo y sin overflow horizontal. `pnpm build` paso. `pnpm lint` sigue bloqueado solo por el error preexistente en `web/src/app/aplicar/page.tsx` sobre usar `Link` en vez de `<a href="/">`.</validation>
  <guardrails>
    <atomicity>Trabajar solamente la narrativa y visuales de `/sistemas`; no tocar formularios, rutas no relacionadas ni integraciones reales.</atomicity>
    <design_quality>Priorizar animaciones profesionales con conexiones claras y texto breve. Evitar secciones largas de copy plano.</design_quality>
    <security>No introducir tokens, webhooks ni credenciales de GHL.</security>
  </guardrails>
</systems_crm_ghl_redesign>

<systems_crm_animation_premium_refinement>
  <status>implemented_validated</status>
  <trigger>Pedido aprobado: las animaciones actuales no son coherentes ni premium; refinar cada efecto de forma aislada.</trigger>
  <scope>Trabajar principalmente `GHLCRMOrbit.tsx`, `CRMFlowMap.tsx` y `CRMScaleSection.tsx` sin reestructurar toda la pagina.</scope>
  <what>Reemplazar el orbital abstracto por un command center CRM/GHL tipo SaaS dashboard, refinar el flujo como automatizacion causal paso a paso, y convertir las escalas en tarjetas compactas con metricas y conectores sutiles.</what>
  <why>La animacion debe explicar una funcion real del CRM y elevar percepcion premium. Si el efecto no comunica producto, se percibe decorativo y resta confianza.</why>
  <business_benefit>Hace mas tangible la oferta de CRM/GHL, ayuda al cliente a imaginar el sistema operando en su negocio y refuerza que la implementacion no es solo estetica sino arquitectura comercial.</business_benefit>
  <implementation_notes>
    <visual_language>SaaS dashboard premium: paneles, pipeline, inbox, automatizaciones, estados y datos conectados.</visual_language>
    <animation_rule>Movimiento sobrio y funcional: status dots, sweep line, paquete de datos, entradas suaves. Evitar constelaciones, orbitas abstractas y flujos sin direccion.</animation_rule>
    <responsive>Desktop con mockup amplio legible; mobile con tarjetas verticales y conectores simples.</responsive>
  </implementation_notes>
  <validation>`/sistemas` verificada en navegador local: hero como command center CRM/GHL, flujo causal y tarjetas de escala presentes. Chrome desktop y mobile 390px confirman sin overflow horizontal. `pnpm build` paso. `pnpm lint` sigue bloqueado solo por el error preexistente en `web/src/app/aplicar/page.tsx` sobre usar `Link` en vez de `<a href="/">`.</validation>
  <guardrails>
    <atomicity>No tocar integraciones reales, formularios ni estructura general fuera de microajustes necesarios.</atomicity>
    <design_quality>Cada efecto debe tener proposito visual: command center, escala operativa o flujo causal.</design_quality>
    <security>No introducir credenciales, webhooks ni tokens de GoHighLevel.</security>
  </guardrails>
</systems_crm_animation_premium_refinement>

<home_remove_faq_section>
  <status>implemented_validated</status>
  <trigger>Comentario en navegador sobre la seccion `PREGUNTAS FRECUENTES` de la home.</trigger>
  <scope>Editar solamente `web/src/app/page.tsx` para que la home deje de renderizar `FAQSection`.</scope>
  <what>Quitar el import dinamico de `FAQSection` y remover `<FAQSection />` del orden de secciones de la home.</what>
  <why>La home ya tiene narrativa, prueba de herramientas y formulario. Sacar FAQ reduce largo, evita una pausa innecesaria antes del contacto y hace mas directo el camino hacia conversion.</why>
  <business_benefit>Menos friccion visual y menos scroll antes del formulario de contacto, manteniendo la pagina mas enfocada en llevar al visitante a conversar.</business_benefit>
  <validation>Recargar `http://localhost:3001/`, confirmar que `section#faq` ya no existe, que `ContactForm` sube despues de `TrustedByStrip`, que no hay errores de consola ni overflow horizontal. Correr check automatico disponible si el cambio lo amerita.</validation>
  <guardrails>
    <atomicity>No borrar `FAQSection.tsx` ni tocar otras rutas/secciones en este bloque.</atomicity>
    <git_hygiene>No revertir cambios existentes del usuario.</git_hygiene>
    <security>No introducir secretos ni cambios de configuracion.</security>
  </guardrails>
  <validation_result>Implementado en `web/src/app/page.tsx`. Validacion local confirmo que `section#faq` ya no existe en `/`, `section#contact` sigue presente, no hay overflow horizontal y TypeScript pasa.</validation_result>
</home_remove_faq_section>

<systems_crm_value_orbit_alignment>
  <status>implemented_validated</status>
  <trigger>Comentario en navegador sobre el diagrama `CRM CONTACTOS WORKFLOWS PIPELINE REPORTING HISTORIAL` en `/sistemas`: las esferas no estan alineadas con sus iconos/labels correspondientes.</trigger>
  <scope>Editar solamente `web/src/components/sections/CRMValueProposition.tsx`.</scope>
  <finding>Los nodos orbitales se posicionan calculando el centro sobre el wrapper completo (`icono + label`) con `translate(-50%, -50%)`. Como el label agrega altura debajo, el centro real de la esfera queda corrido respecto al anillo orbital.</finding>
  <what>Ajustar el markup/posicionamiento de los nodos para que la coordenada orbital corresponda al centro exacto de la esfera, y ubicar el label como elemento anclado debajo de esa esfera. Revisar tambien el ancho/centrado del label para evitar que `Workflows` y laterales se vean desfasados.</what>
  <why>El diagrama debe comunicar precision operativa. Si los nodos visuales estan desalineados, la pieza se siente decorativa o descuidada aunque el concepto sea bueno.</why>
  <business_benefit>Mejora percepcion premium y claridad del bloque CRM, reforzando la idea de sistema ordenado, conectado y profesional.</business_benefit>
  <validation>Recargar `http://localhost:3001/sistemas`, verificar visualmente desktop y mobile que cada esfera cae sobre el anillo y que su label queda centrado bajo el icono. Confirmar sin overflow horizontal ni errores de consola.</validation>
  <guardrails>
    <atomicity>No tocar el contenido comercial ni otras secciones de `/sistemas` en este bloque.</atomicity>
    <design_quality>Mantener la estetica actual; corregir geometria, no redisenar toda la pieza.</design_quality>
    <git_hygiene>No revertir cambios existentes ni mezclar con la eliminacion pendiente de FAQ.</git_hygiene>
  </guardrails>
  <validation_result>Implementado en `web/src/components/sections/CRMValueProposition.tsx`. Validacion local midio `deltaX: 0` entre centro de esfera y centro de label para Contactos, Workflows, Pipeline, Reporting e Historial.</validation_result>
</systems_crm_value_orbit_alignment>

<systems_remove_measurable_impact_section>
  <status>implemented_validated</status>
  <trigger>Comentario en navegador sobre `section#metricas-crm`: sacar la seccion de impacto medible.</trigger>
  <scope>Editar solamente `web/src/app/sistemas/page.tsx` para dejar de renderizar `CRMMetricsImpact`.</scope>
  <what>Quitar el import dinamico de `CRMMetricsImpact` y remover `<CRMMetricsImpact />` del flujo de `/sistemas`.</what>
  <why>La pagina de sistemas ya tiene varios bloques explicativos. Sacar esta seccion reduce largo y evita claims numericos que pueden sentirse menos personales o demasiado genericos.</why>
  <business_benefit>Hace la pagina mas directa, disminuye scroll antes de los bloques comerciales y concentra la venta en sistema, proceso y contacto.</business_benefit>
  <validation>Recargar `http://localhost:3001/sistemas`, confirmar que `section#metricas-crm` ya no existe, que el bloque siguiente sube correctamente, y verificar sin errores de consola ni overflow horizontal en desktop/mobile.</validation>
  <guardrails>
    <atomicity>No borrar `CRMMetricsImpact.tsx` ni tocar otras secciones en este bloque.</atomicity>
    <git_hygiene>No revertir cambios existentes ni mezclar con la eliminacion pendiente de FAQ o el ajuste orbital pendiente.</git_hygiene>
    <security>No introducir secretos ni cambios de configuracion.</security>
  </guardrails>
  <validation_result>Implementado en `web/src/app/sistemas/page.tsx`. Validacion local confirmo que `section#metricas-crm` ya no existe en `/sistemas`.</validation_result>
</systems_remove_measurable_impact_section>

<systems_remove_pricing_section>
  <status>superseded_by_systems_trim_after_pricing</status>
  <trigger>Comentario en navegador sobre `section#pricing`: sacar `Proba Gratis` y todos los planes/precios fantasma de `/sistemas`.</trigger>
  <scope>Editar solamente `web/src/app/sistemas/page.tsx` para dejar de renderizar `PricingSection` en esta pagina.</scope>
  <what>Quitar el import dinamico de `PricingSection` y remover `<PricingSection />` del flujo de `/sistemas`.</what>
  <why>De momento no se van a ofrecer planes con precios en esta pagina. Mantener precios, demos gratis o paquetes inventados puede crear expectativas comerciales incorrectas y bajar confianza.</why>
  <business_benefit>Evita promesas comerciales prematuras, mantiene la pagina enfocada en diagnostico/conversacion y protege la negociacion de propuestas a medida.</business_benefit>
  <validation>Recargar `http://localhost:3001/sistemas`, confirmar que `section#pricing` ya no existe, que el flujo salta de servicios/proceso hacia el siguiente bloque correcto, y verificar sin errores de consola ni overflow horizontal en desktop/mobile.</validation>
  <guardrails>
    <atomicity>No borrar `pricing-section.tsx` ni tocar precios en otros archivos en este bloque; solo retirarlo de `/sistemas`.</atomicity>
    <commercial_truth>No reemplazar por otros precios, descuentos, demos gratis ni claims comerciales no aprobados.</commercial_truth>
    <git_hygiene>No revertir cambios existentes ni mezclar con los pendientes de FAQ, metricas u orbital salvo aprobacion conjunta.</git_hygiene>
  </guardrails>
  <validation_result>El alcance fue ampliado por el comentario posterior: eliminar desde `section#pricing` hacia abajo. Ver `systems_trim_after_pricing`.</validation_result>
</systems_remove_pricing_section>

<systems_trim_after_pricing>
  <status>implemented_validated</status>
  <trigger>Comentario en navegador sobre `section#pricing`: desde esa seccion hacia abajo se puede eliminar todo de la pagina `/sistemas`.</trigger>
  <scope>Editar `web/src/app/sistemas/page.tsx` para remover del render de `/sistemas` los bloques `PricingSection`, `WorkflowSection` y `ContactForm`.</scope>
  <finding>En el orden actual de `/sistemas`, despues de `ServicesCatalog` vienen `PricingSection`, `WorkflowSection` y `ContactForm`. Por lo tanto, eliminar desde `section#pricing` hacia abajo implica retirar esos tres componentes de esta pagina.</finding>
  <what>Quitar los imports dinamicos de `PricingSection`, `WorkflowSection` y `ContactForm`, y eliminar sus JSX del final de `SystemsPage`.</what>
  <why>La pagina debe dejar de ofrecer planes, demos gratis, precios o un funnel comercial largo mientras la oferta no este definida para esta ruta.</why>
  <business_benefit>Reduce ruido comercial, evita expectativas incorrectas y deja `/sistemas` como pagina de posicionamiento/explicacion, no como pagina de compra con planes fantasma.</business_benefit>
  <validation>Recargar `http://localhost:3001/sistemas`, confirmar que no existen `section#pricing`, workflow posterior ni `section#contact` en esa ruta, revisar que el footer suba correctamente, y verificar consola/overflow en desktop y mobile. Revisar si algun CTA previo queda apuntando a `#contact` y reportarlo o ajustarlo si forma parte del alcance aprobado.</validation>
  <guardrails>
    <atomicity>No borrar los componentes de origen; solo retirarlos de `/sistemas`.</atomicity>
    <commercial_truth>No reemplazar por otros precios, descuentos, demos gratis ni claims comerciales no aprobados.</commercial_truth>
    <git_hygiene>No revertir cambios existentes ni tocar rutas ajenas.</git_hygiene>
  </guardrails>
  <validation_result>Implementado en `web/src/app/sistemas/page.tsx`: se removieron `PricingSection`, `WorkflowSection` y `ContactForm` del render de `/sistemas`. Validacion local confirmo ausencia de `section#pricing`, texto de workflow posterior y `section#contact`; tambien se corrigio el CTA restante de `ProblemSolution` para enlazar a `/aplicar`.</validation_result>
</systems_trim_after_pricing>

<systems_remove_operational_diagnosis_section>
  <status>implemented_validated</status>
  <trigger>Comentario en navegador sobre la seccion `DIAGNOSTICO OPERATIVO / De fuga comercial a sistema activo` en `/sistemas`: sacarla tambien.</trigger>
  <scope>Editar solamente `web/src/app/sistemas/page.tsx` para dejar de renderizar `ProblemSolution` en esta pagina.</scope>
  <finding>El bloque seleccionado corresponde al componente `ProblemSolution`, importado dinamicamente y renderizado antes de `ServicesCatalog`.</finding>
  <what>Quitar el import dinamico de `ProblemSolution` y remover `<ProblemSolution />` del flujo de `/sistemas`.</what>
  <why>Despues de retirar precios, metricas y funnel inferior, esta seccion queda como otro bloque de diagnostico/venta que alarga la pagina. Sacarla mantiene `/sistemas` mas enfocada en CRM, flujo y catalogo de servicios.</why>
  <business_benefit>Reduce friccion y repeticion, dejando una pagina mas limpia para explicar capacidad tecnica sin empujar una promesa comercial adicional.</business_benefit>
  <validation>Recargar `http://localhost:3001/sistemas`, confirmar que ya no aparece el texto `Diagnostico operativo` ni `De fuga comercial a sistema activo`, que `ServicesCatalog` sube correctamente despues del flujo CRM, y verificar consola/overflow en desktop y mobile.</validation>
  <guardrails>
    <atomicity>No borrar `problem-solution.tsx`; solo retirarlo de `/sistemas`.</atomicity>
    <git_hygiene>No revertir cambios existentes ni tocar rutas ajenas.</git_hygiene>
    <security>No introducir secretos ni cambios de configuracion.</security>
  </guardrails>
  <validation_result>Implementado en `web/src/app/sistemas/page.tsx`. Validacion local confirmo que ya no aparece `Diagnostico operativo` ni `De fuga comercial`, sin overflow horizontal; el flujo queda de `CRMFlowMap` a `ServicesCatalog`.</validation_result>
</systems_remove_operational_diagnosis_section>

<bottom_nav_icon_alignment>
  <status>implemented_validated</status>
  <trigger>Comentario en navegador sobre la barra inferior: centrar bien los iconos en las animaciones de navegacion, especialmente el item `Case Studies`.</trigger>
  <scope>Editar `web/src/components/sections/navbar.tsx` y validar la barra inferior en rutas `/`, `/sistemas`, `/casos-de-exito` y `/aplicar`.</scope>
  <finding>La barra usa botones con ancho variable por labels animados y un indicador activo con `layoutId="active-pill"` sobre `inset-0`. Cuando el label se expande/colapsa, el icono no queda visualmente centrado en su zona de control, y el pill animado acompana todo el ancho del boton.</finding>
  <what>Ajustar la estructura de cada item para separar una caja fija del icono y el label animado. El icono debe vivir en un wrapper de dimensiones estables y centrado con `grid place-items-center`; el label puede expandirse sin desplazar la alineacion interna del icono. Revisar tambien el CTA para que mantenga la misma disciplina visual.</what>
  <why>La navegacion inferior es un elemento persistente. Si el indicador activo o el icono se ven corridos, la interfaz pierde precision justo en una pieza que acompana toda la experiencia.</why>
  <business_benefit>Mejora percepcion de calidad y pulido en todas las paginas, especialmente durante transiciones y scroll, sin cambiar la arquitectura de navegacion.</business_benefit>
  <validation>Recargar rutas principales en `http://localhost:3001`, verificar visualmente desktop/mobile y medir que los iconos queden centrados dentro de su wrapper activo. Confirmar sin overflow horizontal ni errores de consola.</validation>
  <guardrails>
    <atomicity>No cambiar rutas, labels ni comportamiento de navegacion; solo ajustar alineacion y estructura visual del item.</atomicity>
    <design_quality>Mantener la estetica actual de isla flotante, pill activo y CTA verde.</design_quality>
    <git_hygiene>No revertir cambios existentes ni mezclar con la eliminacion pendiente de diagnostico operativo salvo aprobacion conjunta.</git_hygiene>
  </guardrails>
  <validation_result>Implementado en `web/src/components/sections/navbar.tsx`. Validacion local en `/casos-de-exito` midio `deltaX: 0` para Home, Systems, Case Studies y Apply en desktop y mobile colapsado; capturas confirman el icono activo centrado.</validation_result>
</bottom_nav_icon_alignment>

<home_hero_remove_counters>
  <status>implemented_validated</status>
  <trigger>Comentario en navegador sobre los contadores del hero de home: `12+ shipped products`, `4 core disciplines`, `∞ lateral solutions`.</trigger>
  <scope>Editar solamente `web/src/components/sections/hero-section.tsx` para remover el bloque de metricas de confianza.</scope>
  <what>Quitar el `<motion.dl>` de contadores del hero y dejar los CTAs como cierre principal del primer viewport.</what>
  <why>Los contadores pueden sentirse arbitrarios o decorativos. Sacarlos limpia el hero y evita claims numericos que no aportan a la accion principal.</why>
  <business_benefit>Primer viewport mas enfocado en posicionamiento y CTA, con menos ruido visual y menos necesidad de justificar metricas.</business_benefit>
  <validation>Recargar `http://localhost:3001/`, confirmar que el bloque de contadores ya no existe, que el hero conserva buen balance vertical en desktop/mobile, y verificar sin errores de consola ni overflow horizontal.</validation>
  <guardrails>
    <atomicity>No tocar copy, CTAs, red neuronal ni indicadores tecnicos en esta fase.</atomicity>
    <design_quality>Asegurar que al remover el bloque no quede demasiado espacio vacio ni el CTA pegado al borde inferior.</design_quality>
    <git_hygiene>No revertir cambios existentes ni tocar rutas ajenas.</git_hygiene>
  </guardrails>
  <validation_result>Implementado en `web/src/components/sections/hero-section.tsx`. Validacion local confirmo que ya no aparecen `SHIPPED PRODUCTS`, `CORE DISCIPLINES` ni `LATERAL SOLUTIONS`; el hero conserva CTAs y no presenta overflow horizontal.</validation_result>
</home_hero_remove_counters>

<home_adaptive_approach_modular_redesign>
  <status>implemented_validated</status>
  <trigger>Comentario en navegador sobre `section#enfoque`: los copys gustan, pero la seccion se siente repetitiva y no debe insistir en `daily tested toolbox`.</trigger>
  <scope>Redisenar `web/src/components/sections/AdaptiveApproach.tsx` manteniendo la idea central de criterio adaptable, pero cambiando la estructura visual y narrativa.</scope>
  <finding>La seccion actual usa dos tabs (`Synergy Projects` y `Agile Solutions`) y una grilla lateral `Daily tested toolbox`. Aunque el copy comunica curiosidad y criterio, visualmente vuelve a poner el foco en una lista de herramientas, no en como se decide que herramienta usar ni como se combinan modulos para resolver detalles concretos.</finding>
  <what>Convertir la seccion en un sistema de decision modular: problema detectado -> modulo/herramienta adecuada -> refinamiento fino -> integracion final. Reutilizar parte del copy actual, pero reemplazar la grilla repetitiva por bloques de desempeno: por ejemplo `Captacion`, `Operacion`, `Contenido`, `Automatizacion`, `Experiencia`, `Detalle fino`, cada uno con una herramienta/criterio asociado y una descripcion breve de donde rinde mejor.</what>
  <why>La idea fuerte no es probar herramientas por probarlas; es saber que hace mejor cada una, donde falla, y como combinarlas para atacar problemas de forma modular hasta pulir detalles pequenos.</why>
  <business_benefit>Eleva el posicionamiento desde “uso muchas herramientas” hacia “tengo criterio tecnico-operativo para armar la combinacion correcta”, lo que vende mas confianza consultiva y menos moda tecnologica.</business_benefit>
  <proposed_structure>
    <header>Mantener el concepto `Tools change daily. Criteria doesn't.` con un parrafo mas orientado a diagnostico y desempeno por herramienta.</header>
    <visual_model>Reemplazar tabs + toolbox por un mapa modular con 4 a 6 modulos conectados, cada uno explicando donde una herramienta destaca y que problema resuelve.</visual_model>
    <detail_layer>Agregar una pequena capa de refinamiento: `testear`, `medir`, `ajustar`, `integrar`, para representar el pulido de detalles pequenos.</detail_layer>
    <cta>Mantener el CTA hacia `/aplicar` sin crear una oferta nueva.</cta>
  </proposed_structure>
  <validation>Recargar `http://localhost:3001/`, revisar `section#enfoque` en desktop/mobile, confirmar que no se repite `Daily tested toolbox`, que no hay overflow horizontal, que el copy conserva la idea aprobada y que TypeScript pasa.</validation>
  <guardrails>
    <atomicity>No tocar hero, filosofia, contacto ni rutas fuera de esta seccion en esta fase.</atomicity>
    <copy_tone>Mantener tono personal/profesional; evitar sonar como catalogo de tecnologias o promesa generica de agencia.</copy_tone>
    <design_quality>Evitar una simple lista de cards. La seccion debe comunicar decision modular y refinamiento, no inventario.</design_quality>
    <git_hygiene>No revertir cambios existentes ni mezclar con el retiro pendiente de contadores del hero salvo aprobacion conjunta.</git_hygiene>
  </guardrails>
  <validation_result>Implementado en `web/src/components/sections/AdaptiveApproach.tsx`. Se reemplazo tabs + `Daily tested toolbox` por diagnostico modular, ciclo `Diagnose/Match/Refine/Integrate` y modulos de desempeno por herramienta. Validacion local confirmo que `Daily tested toolbox` ya no aparece, sin overflow horizontal y TypeScript pasa.</validation_result>
</home_adaptive_approach_modular_redesign>

<home_expand_trusted_by_tech_strip>
  <status>implemented_validated</status>
  <trigger>Comentario en navegador sobre `TrustedByStrip`: faltan tecnologias como Anthropic, Gemini, Grok, WordPress, Meta, Astro, HTML, Vite, bibliotecas populares y CRMs importantes.</trigger>
  <scope>Editar `web/src/components/sections/TrustedByStrip.tsx`.</scope>
  <what>Reemplazar SVGs inline por iconos de `react-icons/si`, ampliar el ecosistema tecnologico en dos filas de marquee, y usar fallbacks tipograficos para `GoHighLevel` (`GHL`) y `Pipedrive` (`PD`) donde no hay icono disponible en la version instalada.</what>
  <why>El strip debe representar amplitud real del stack y criterio de herramientas, sin quedarse en una lista corta que omite tecnologias conocidas por clientes.</why>
  <business_benefit>Refuerza percepcion de dominio transversal: IA/modelos, web, automatizacion, backend, marketing, comercio y CRM.</business_benefit>
  <validation_result>`pnpm exec tsc --noEmit` paso. Validacion local en `/` desktop/mobile confirmo dos filas, sin overflow horizontal, con Anthropic, Google Gemini, Grok/xAI, WordPress, Meta, Astro, HTML5, Vite, HubSpot, Salesforce, Zoho CRM, GoHighLevel, Pipedrive y fallbacks `GHL`/`PD` presentes. `pnpm lint` sigue bloqueado por errores preexistentes en `/aplicar`, `CRMBeforeAfter` y warnings de `portfolio-section`.</validation_result>
  <guardrails>
    <dependency_policy>No se agregaron dependencias nuevas ni assets externos.</dependency_policy>
    <asset_policy>No se guardaron logos en `public`; se usaron iconos disponibles en `react-icons/si`.</asset_policy>
  </guardrails>
</home_expand_trusted_by_tech_strip>

<home_header_orchestrated_tech_rewrite>
  <status>implemented_validated</status>
  <trigger>Objetivo: reescribir el header desde cero porque no se siente impactante; explorar una animacion/imagen/video de fondo o llevarlo a minimalismo absoluto con tecnologias flotando y complementandose con planes de implementacion.</trigger>
  <scope>Redisenar el primer viewport de la home, principalmente `web/src/components/sections/hero-section.tsx`; reemplazar o retirar `HeroNeuralSVG` si deja de aportar. No tocar secciones posteriores salvo ajustes menores de continuidad visual.</scope>
  <current_state>
    <finding>El hero actual usa un fondo mesh, `HeroNeuralSVG`, badge rotativo, H1 `Tech & Creative Orchestrator`, tagline, subtitulo y dos CTAs.</finding>
    <finding>`HeroNeuralSVG` comunica red/data-pulses, pero no muestra tecnologias concretas ni planes de implementacion; se percibe decorativo.</finding>
    <finding>Existe `web/src/components/animations/TechEcosystemOrbit.tsx`, pero es un orbital pequeño/generico con nodos tipo Targeting IA, Automatizacion, Analytics. No alcanza como header impactante ni representa el stack real ampliado.</finding>
  </current_state>
  <recommended_direction>Minimalismo absoluto con una animacion full-bleed hecha en React/Framer Motion/SVG: tecnologias flotantes reales se conectan a tres planes de implementacion (`Diagnosticar`, `Construir`, `Automatizar/Escalar`) y envian pulsos hacia un nucleo central de orquestacion.</recommended_direction>
  <what>
    <step>Crear una nueva escena visual dentro del hero, por ejemplo `OrchestratedTechHeroScene`, usando iconos de `react-icons/si` ya disponibles y elementos SVG/CSS animados. Evitar video externo para no sumar peso ni assets nuevos.</step>
    <step>Reemplazar el fondo actual de `HeroNeuralSVG` por una composicion hero-specific: nodos de tecnologias flotando en capas, lineas sutiles, pulsos de datos y tres tarjetas/planes de implementacion minimalistas.</step>
    <step>Reducir el texto del hero para que la animacion respire: mantener el H1, convertir el subtitulo a una frase mas directa sobre orquestar tecnologia, contenido y operaciones, y dejar los CTAs como acciones principales.</step>
    <step>Usar `useReducedMotion` para entregar una version estatica o con animacion minima si el usuario prefiere menos movimiento.</step>
  </what>
  <why>La propuesta visual debe demostrar la tesis central: no es usar muchas tecnologias, sino orquestarlas como modulos complementarios para crear implementaciones concretas que producen resultado.</why>
  <business_benefit>Un primer viewport mas impactante y claro aumenta percepcion premium, explica el diferencial en segundos y hace que el visitante entienda que MMorera combina herramientas, criterio y ejecucion en sistemas reales.</business_benefit>
  <implementation_notes>
    <visual_language>Oscuro, sobrio, mucho espacio negativo, no una constelacion cargada. Tecnologias como pequenos chips flotantes, no como carnaval de logos.</visual_language>
    <tech_groups>AI/modelos, web/frontend, automatizacion/CRM, backend/data, marketing/contenido.</tech_groups>
    <implementation_plans>Representar tres planes como carriles o nodos: `Diagnosticar`, `Implementar`, `Refinar/Escalar`. Cada tecnologia debe parecer conectarse a una funcion dentro del plan, no flotar sin sentido.</implementation_plans>
    <performance>No introducir Three.js ni video pesado en esta iteracion; usar Framer Motion + SVG para mantener carga rapida y control responsive.</performance>
    <responsive>Desktop con escena amplia alrededor del H1; mobile con menos nodos, carriles compactos y sin solapar CTA/nav/WhatsApp.</responsive>
  </implementation_notes>
  <validation>Validar `http://localhost:3001/` con navegador en desktop y mobile: primer viewport no debe estar vacio, la escena debe animar/conectar tecnologias, no debe haber overlap con navbar/WhatsApp, no debe haber overflow horizontal, y `pnpm exec tsc --noEmit` debe pasar. `pnpm lint` puede seguir reportando errores preexistentes, que deben documentarse.</validation>
  <validation_result>Implementado en `web/src/components/sections/hero-section.tsx`. Se reemplazo `HeroNeuralSVG` por `OrchestratedTechHeroScene`, con tecnologias reales flotando, lineas SVG, pulsos, nucleo de orquestacion y planes `Diagnosticar`, `Implementar`, `Refinar / Escalar`. El copy del hero se simplifico y los CTAs actuales se mantuvieron hacia `/aplicar` y `/casos-de-exito`. Validacion local: `pnpm exec tsc --noEmit` paso; navegador en `/` confirmo sin overflow horizontal, tecnologias y planes presentes; captura mobile 390x844 confirmo que los CTAs no solapan con navbar ni WhatsApp. `pnpm lint` sigue bloqueado por errores preexistentes en `web/src/app/aplicar/page.tsx` y `web/src/components/sections/CRMBeforeAfter.tsx`, mas warnings preexistentes en `portfolio-section.tsx`.</validation_result>
  <guardrails>
    <atomicity>No tocar portfolio, sistemas, formulario ni strip de tecnologias en esta fase.</atomicity>
    <asset_policy>No descargar videos ni imagenes externas salvo aprobacion explicita; priorizar animacion nativa para velocidad y control.</asset_policy>
    <design_quality>Evitar orbes decorativos genericos y SVG hero ilustrativo sin contenido. Cada elemento visual debe representar orquestacion modular real.</design_quality>
    <accessibility>Respetar `prefers-reduced-motion` y mantener H1/CTAs legibles sobre la animacion.</accessibility>
    <git_hygiene>No revertir cambios existentes del usuario.</git_hygiene>
  </guardrails>
</home_header_orchestrated_tech_rewrite>

<home_hero_spiral_tech_redesign>
  <status>waiting_for_vibe_approval</status>
  <trigger>Pedido del usuario: El header actual se siente caótico. Rediseñar a un concepto más limpio: una espiral de tecnologías responsiva al mouse que converja en resultados.</trigger>
  <scope>Rediseñar la escena visual del Hero en `web/src/components/sections/hero-section.tsx` (reemplazar la escena actual por la espiral interactiva en 2.5D/3D).</scope>
  <what>
    <step>Reemplazar `OrchestratedTechHeroScene` por una nueva escena: `SpiralTechHeroScene`.</step>
    <step>Calcular posiciones de los logos de tecnologías a lo largo de una espiral logarítmica (r = a * e^(b * theta)) que comience en el exterior y converja hacia el centro.</step>
    <step>Ubicar un núcleo central de "Resultados" (o "Sistemas / Crecimiento / MMorera") en el ojo de la espiral, con un diseño de glow radial y un pulso animado premium.</step>
    <step>Implementar interactividad con el cursor: registrar la posición del mouse y usar `useSpring` para suavizar el desplazamiento (efecto paralaje 3D en la rotación y posición de la espiral).</step>
    <step>Hacer la animación responsiva: en pantallas móviles, simplificar la espiral a 5-6 nodos principales con animación de rotación automática y suave (sin hover ni paralaje por mouse para ahorrar batería y mejorar UX táctil).</step>
    <step>Limpiar líneas cruzadas y elementos que generen ruido visual ("caos") para lograr una composición minimalista de alta gama ('Deep Space').</step>
  </what>
  <why>La espiral proporciona una metáfora visual clara de cómo los diferentes componentes del stack (IA, CRM, automatización, web) no están dispersos al azar, sino que se integran y canalizan hacia un único punto de valor: los resultados de negocio.</why>
  <business_benefit>Aumenta el impacto visual premium al primer contacto, reduce la carga cognitiva del visitante y refuerza el posicionamiento de Mario Morera como arquitecto de soluciones orientadas a resultados comerciales concretos.</business_benefit>
  <validation>
    <check>Verificar `http://localhost:3001` en Chrome desktop: mover el mouse y confirmar que la espiral rota y se desplaza suavemente sin saltos ni tirones (60fps).</check>
    <check>Verificar en responsive móvil (ej. 390px): que la espiral se vea centrada, legible, con menos elementos y sin overflow horizontal.</check>
    <check>Correr `pnpm exec tsc --noEmit` para asegurar compatibilidad de tipos.</check>
  </validation>
  <guardrails>
    <accessibility>Respetar `prefers-reduced-motion` cancelando la interactividad del mouse y los movimientos dinámicos si está activo.</accessibility>
    <performance>Optimizar la renderización limitando los cálculos pesados en cada render. Usar transforms de CSS acelerados por GPU (`transform-gpu`, `translate3d`).</performance>
    <aesthetics>Usar la paleta de colores del diseño (esmeralda, cian, ámbar y blanco apagado con opacidades sutiles y glows tipo vidrio esmerilado).</aesthetics>
  </guardrails>
  <request>Aprobación explícita del usuario para iniciar la codificación de esta espiral interactiva en el Hero.</request>
</home_hero_spiral_tech_redesign>

<home_multilanguage_system>
  <status>waiting_for_vibe_approval</status>
  <trigger>Pedido del usuario: Hay secciones en inglés y otras en español. Diseñar un botón/selector de idioma y un sistema multilenguaje coherente.</trigger>
  <scope>Crear el contexto de traducción, el diccionario de términos en español/inglés, el botón selector flotante premium y adaptar los componentes principales de la home y la navegación.</scope>
  <what>
    <step>Crear [LanguageContext.tsx](file:///Users/mariomorera/Desktop/MMORERA/web/src/context/LanguageContext.tsx) para proveer el idioma actual (es/en) y la función de toggle/set persistiendo el estado en `localStorage` de forma segura frente a desajustes de hidratación en Next.js.</step>
    <step>Crear un diccionario central de traducciones en [translations.ts](file:///Users/mariomorera/Desktop/MMORERA/web/src/data/translations.ts) con las traducciones de las secciones principales (Hero, About, AdaptiveApproach, Philosophy, TrustedBy, ContactForm, Navbar, Footer).</step>
    <step>Crear un selector de idioma interactivo y premium: [LanguageSwitcher.tsx](file:///Users/mariomorera/Desktop/MMORERA/web/src/components/ui/LanguageSwitcher.tsx). Será un botón flotante (`fixed top-6 right-6 z-[101]`) o integrado sutilmente, con glassmorphism, micro-animación al hover y un interruptor deslizable que marque `ES` y `EN` con un sutil glow esmeralda.</step>
    <step>Envolver la aplicación con el proveedor de idioma en el layout raíz [layout.tsx](file:///Users/mariomorera/Desktop/MMORERA/web/src/app/layout.tsx).</step>
    <step>Adaptar componentes quemados de la home (`hero-section.tsx`, `AboutSection.tsx`, `PhilosophySection.tsx`, `AdaptiveApproach.tsx`, `contact-form.tsx`, `navbar.tsx`, `footer.tsx`) para consumir las traducciones del hook `useLanguage` de forma transparente.</step>
  </what>
  <why>Unificar la experiencia lingüística previene la confusión comercial de recibir mensajes mixtos (español e inglés sin orden), y le da al sitio una escala verdaderamente global e internacional.</why>
  <business_benefit>Asegura que clientes tanto locales (latinoamericanos/hispanos) como globales (estadounidenses/angloparlantes en Miami y el resto del mundo) entiendan el valor y la propuesta completa sin fricción idiomática, elevando las conversiones.</business_benefit>
  <validation>
    <check>Verificar `http://localhost:3001` en local: clickear el selector de idioma y confirmar que toda la página cambia de idioma de inmediato sin recargas bruscas ni parpadeos raros.</check>
    <check>Refrescar la página y comprobar que el idioma seleccionado persiste a través de localStorage.</check>
    <check>Correr `pnpm exec tsc --noEmit` para garantizar la corrección de tipos en los archivos modificados.</check>
  </validation>
  <guardrails>
    <hydration_safeguard>Esperar a que el componente se monte en el cliente (`mounted === true`) antes de renderizar el selector o usar localStorage, para evitar errores de mismatch de hidratación entre servidor y cliente.</hydration_safeguard>
    <aesthetics>El botón flotante debe ser ultra minimalista (un pill con glassmorphism oscuro) que calce con la estética 'Deep Space' y no compita con el H1 o el menú flotante inferior en mobile.</aesthetics>
  </guardrails>
  <request>Aprobación explícita del usuario para iniciar la codificación e integración del sistema multilenguaje.</request>
</home_multilanguage_system>

<full_pass_visual_audit_session_2026_05_30>
  <status>approved_in_progress</status>
  <trigger>Usuario aprobo implementar la auditoria full pass y dejar `web` levantado en local para anotaciones visuales.</trigger>
  <scope>Trabajar sobre `/Users/mariomorera/Desktop/MMORERA/web`. No intervenir `AD Media Solution` ni `agencia-de-automatización-ia` en esta sesion.</scope>
  <goal>Levantar la app en local y auditar percepcion visual, negocio, UX, rutas, consola, responsive y salud tecnica antes de aplicar cambios de producto o codigo.</goal>
  <current_state>
    <finding>`pnpm build` compila correctamente.</finding>
    <finding>No habia servidor activo en puertos `3000-3003` durante la exploracion inicial.</finding>
    <finding>`npm` local falla por una instalacion global rota; usar `pnpm` como carril operativo para esta app.</finding>
    <finding>`pnpm lint` falla con deuda existente en hooks/contextos y tipos `any`: `AplicarOS.tsx`, `portfolio-section.tsx`, `LanguageContext.tsx`, `TrackContext.tsx` y `systemsData.ts`.</finding>
    <finding>`pnpm test` queda colgado en `src/lib/chat-api.test.ts`; aislarlo antes de confiar en la suite.</finding>
    <finding>Hay mezcla de marca/copy: referencias a `NEXO`, `MMORE`, `Mathias`, `Supabase` y `MMorera`.</finding>
    <finding>El footer mantiene placeholders con `href="#"` en enlaces sociales/legales.</finding>
  </current_state>
  <work_phases>
    <phase name="1_local_run">
      <what>Levantar `web` con `pnpm dev` en `http://localhost:3000`; si el puerto se ocupa, usar `3001`.</what>
      <why>La auditoria debe hacerse sobre la experiencia real renderizada, con hot reload y consola disponible.</why>
      <business_benefit>Permite revisar conversion, claridad y confianza en contexto antes de invertir tiempo en cambios aislados.</business_benefit>
    </phase>
    <phase name="2_visual_and_technical_audit">
      <what>Revisar `/`, `/sistemas`, `/estudio`, `/casos-de-exito`, `/aplicar` y `/portfolio-preview` en desktop y mobile `390px`.</what>
      <why>Estas rutas cubren el embudo principal: propuesta, sistemas, estudio, prueba de trabajo, aplicacion y preview.</why>
      <business_benefit>Detecta fricciones que pueden bajar confianza o conversion: solapamientos, CTA debiles, copy inconsistente, consola ruidosa o rutas rotas.</business_benefit>
    </phase>
    <phase name="3_annotations_to_tasks">
      <what>Convertir anotaciones visuales del usuario en tareas pequeñas y aprobables, una por vez.</what>
      <why>El feedback visual funciona mejor cuando se transforma en cambios atomicos con validacion inmediata.</why>
      <business_benefit>Evita retrabajo, conserva coherencia premium y permite mejorar rapido sin romper secciones sanas.</business_benefit>
    </phase>
    <phase name="4_validation_after_each_change">
      <what>Despues de cada cambio futuro, recargar navegador, revisar consola/overflow y correr `pnpm build`; reintentar `pnpm lint` cuando se aborde deuda tecnica.</what>
      <why>Cada mejora debe terminar comprobada en la ruta real y con checks automaticos cuando correspondan.</why>
      <business_benefit>Reduce riesgo operativo antes de demo, venta o despliegue.</business_benefit>
    </phase>
  </work_phases>
  <validation_plan>
    <check>Confirmar que el servidor queda disponible en la URL local elegida.</check>
    <check>Abrir la app en navegador local visible para que el usuario pueda anotar detalles.</check>
    <check>Auditar primer viewport, jerarquia, CTAs, navegacion inferior, portfolio, contacto, consola y responsive.</check>
    <check>No exponer secretos; usar `.env` o variables de entorno si se valida formulario/chat con servicios reales.</check>
  </validation_plan>
  <guardrails>
    <atomicity>Una mejora por vez: detectar, acordar, implementar y validar.</atomicity>
    <security>No escribir API keys, tokens ni secretos en codigo, prompts persistentes o archivos versionados.</security>
    <insforge>Si aparece trabajo nuevo de integracion InsForge, primero obtener documentacion oficial actualizada mediante MCP.</insforge>
    <git_hygiene>No revertir cambios existentes del usuario. Reportar archivos tocados al finalizar.</git_hygiene>
    <design_quality>Priorizar una experiencia sobria, clara, premium, responsive y sin solapamientos.</design_quality>
  </guardrails>
</full_pass_visual_audit_session_2026_05_30>

<studio_remove_creative_services_section>
  <status>implemented_validated</status>
  <trigger>Comentario visual en navegador sobre `/estudio`: "sacamos esta seccion" apuntando a la seccion `LO QUE HAGO / SERVICIOS CREATIVOS`.</trigger>
  <scope>Editar solamente la composicion de la ruta `/estudio` en `web/src/app/estudio/page.tsx`.</scope>
  <what>Quitar el render de `CreativeServices` y su import dinamico para que la seccion de servicios creativos no aparezca en la pagina Estudio.</what>
  <why>La pagina debe quedar mas enfocada y menos repetitiva; esta seccion agrega densidad visual entre la trayectoria y el proceso.</why>
  <business_benefit>Reduce scroll y ruido comercial, haciendo que el track creativo se sienta mas curado y directo.</business_benefit>
  <validation>Recargar `http://localhost:3000/estudio`, confirmar que `LO QUE HAGO / SERVICIOS CREATIVOS` ya no aparece, que la pagina fluye de `AboutTimeline` a `ProcessFilm`, y correr checks automaticos disponibles.</validation>
  <validation_result>`/estudio` recargada en navegador local: la seccion `LO QUE HAGO / SERVICIOS CREATIVOS` y el copy `POSTPRODUCCION AUDIOVISUAL REMOTA` ya no aparecen; no hay overflow horizontal. `pnpm exec tsc --noEmit` paso y `pnpm build` paso.</validation_result>
  <guardrails>
    <atomicity>Solo remover esta seccion de `/estudio`; no borrar `CreativeServices.tsx` ni tocar otros tracks.</atomicity>
    <git_hygiene>No revertir cambios existentes del usuario.</git_hygiene>
  </guardrails>
</studio_remove_creative_services_section>

<studio_remove_process_film_section>
  <status>implemented_validated</status>
  <trigger>Comentario visual en navegador sobre `/estudio`: "esta tambien" apuntando a la seccion `COMO TRABAJO / DE LA IDEA CRUDA A LA PIEZA FINAL`.</trigger>
  <scope>Editar solamente la composicion de la ruta `/estudio` en `web/src/app/estudio/page.tsx`.</scope>
  <what>Quitar el render de `ProcessFilm` y su import dinamico para que la seccion de proceso creativo no aparezca en la pagina Estudio.</what>
  <why>Despues de quitar servicios creativos, esta segunda seccion mantiene densidad narrativa que el usuario quiere simplificar.</why>
  <business_benefit>Acorta la pagina, reduce friccion visual y concentra la experiencia en hero, trayectoria y accion final.</business_benefit>
  <validation>Recargar `http://localhost:3000/estudio`, confirmar que `COMO TRABAJO / DE LA IDEA CRUDA A LA PIEZA FINAL` ya no aparece, que la pagina fluye de `AboutTimeline` a `CrossTrackBridge`, y correr checks automaticos disponibles.</validation>
  <validation_result>`/estudio` recargada en navegador local: la seccion `COMO TRABAJO / DE LA IDEA CRUDA A LA PIEZA FINAL` ya no aparece; tampoco reaparece `SERVICIOS CREATIVOS`; no hay overflow horizontal. `pnpm exec tsc --noEmit` paso y `pnpm build` paso.</validation_result>
  <guardrails>
    <atomicity>Solo remover esta seccion de `/estudio`; no borrar `ProcessFilm.tsx` ni tocar otros tracks.</atomicity>
    <git_hygiene>No revertir cambios existentes del usuario.</git_hygiene>
  </guardrails>
</studio_remove_process_film_section>

<studio_remove_cross_track_bridge_section>
  <status>implemented_validated</status>
  <trigger>Comentario visual en navegador sobre `/estudio`: "esta tambien la sacamos" apuntando al puente `Y SI ADEMAS NECESITAS SISTEMAS`.</trigger>
  <scope>Editar solamente la composicion de la ruta `/estudio` en `web/src/app/estudio/page.tsx`.</scope>
  <what>Quitar el render de `CrossTrackBridge` y su import dinamico para que el puente hacia sistemas no aparezca al final de Estudio.</what>
  <why>El usuario quiere depurar el track creativo y remover bloques de cierre que agregan ruido o empujan a otra narrativa.</why>
  <business_benefit>La pagina queda mas corta, curada y concentrada en la identidad creativa sin desviar al visitante hacia sistemas.</business_benefit>
  <validation>Recargar `http://localhost:3000/estudio`, confirmar que el copy `Y SI ADEMAS NECESITAS SISTEMAS` y el boton `VER SOFTWARE & SISTEMAS` ya no aparecen, y correr checks automaticos disponibles.</validation>
  <validation_result>`/estudio` recargada en navegador local: el puente hacia sistemas ya no aparece; tampoco aparecen las secciones removidas previamente (`SERVICIOS CREATIVOS` y `COMO TRABAJO`). No hay overflow horizontal. `pnpm exec tsc --noEmit` paso y `pnpm build` paso.</validation_result>
  <guardrails>
    <atomicity>Solo remover esta seccion de `/estudio`; no borrar `CrossTrackBridge.tsx` ni tocar `/sistemas`.</atomicity>
    <git_hygiene>No revertir cambios existentes del usuario.</git_hygiene>
  </guardrails>
</studio_remove_cross_track_bridge_section>

<studio_about_traditional_rewrite>
  <status>implemented_validated</status>
  <trigger>Comentario visual en navegador sobre `/estudio`: el bloque `SOBRE MI / DETRAS DE LAS HERRAMIENTAS` no se entiende y debe manejarse de una manera mas tradicional.</trigger>
  <scope>Reemplazar la implementacion de `web/src/components/portfolio-isolated/AboutTimeline.tsx` manteniendo el id `sobre-mi-timeline` para compatibilidad de anclas.</scope>
  <what>Convertir la seccion experimental de monitor/timeline en un bloque tradicional de Sobre mi: encabezado claro, parrafos breves, tres areas de experiencia y una lista de aportes concretos.</what>
  <why>La narrativa actual depende de una metafora audiovisual compleja; para comunicar confianza, trayectoria y criterio conviene una estructura mas directa.</why>
  <business_benefit>Mejora comprension inmediata, reduce friccion y hace que la propuesta personal se perciba mas profesional y vendible.</business_benefit>
  <validation>Recargar `http://localhost:3000/estudio`, confirmar que ya no aparece `DETRAS DE LAS HERRAMIENTAS`, que la seccion muestra una estructura tradicional clara, sin overflow horizontal, y correr checks automaticos disponibles.</validation>
  <validation_result>`/estudio` recargada en navegador local: ya no aparece `DETRAS DE LAS HERRAMIENTAS`; la seccion ahora muestra `Una mirada practica entre creatividad, tecnologia y operacion`, perfil de trabajo y tres areas claras. No hay overflow horizontal. `pnpm exec tsc --noEmit`, lint enfocado de `AboutTimeline.tsx`/`estudio/page.tsx` y `pnpm build` pasaron.</validation_result>
  <guardrails>
    <atomicity>Solo reescribir esta seccion. No tocar hero, navbar, footer ni otras rutas.</atomicity>
    <design_quality>Texto claro, menos metafora, layout tradicional sobrio y responsive.</design_quality>
    <git_hygiene>No revertir cambios existentes del usuario.</git_hygiene>
  </guardrails>
</studio_about_traditional_rewrite>

<social_share_image_mmorera_agency>
  <status>implemented_validated</status>
  <trigger>Pedido del usuario: al compartir la web, la imagen debe ser el logo de MMorera Agency y no el de Vercel.</trigger>
  <scope>Actualizar metadata global y generar imagenes sociales para `web`, sin tocar contenido visible de las paginas.</scope>
  <what>
    <step>Crear rutas especiales `opengraph-image.tsx` y `twitter-image.tsx` con `ImageResponse`, usando el logo MM existente como base visual y texto `MMorera Agency`.</step>
    <step>Actualizar `web/src/app/layout.tsx` para declarar `metadataBase`, `openGraph.images`, `twitter.card`, `twitter.images` y JSON-LD apuntando al nuevo asset social.</step>
    <step>Eliminar referencias a `/og-image.png`, actualmente inexistente.</step>
  </what>
  <why>Los previews de WhatsApp, LinkedIn, X/Twitter y otros scrapers dependen de metadata social explicita; si falta, pueden caer a iconos/fallbacks no deseados.</why>
  <business_benefit>Mejora consistencia de marca en cada enlace compartido y evita que una preview con Vercel reduzca percepcion profesional.</business_benefit>
  <validation>Verificar `/opengraph-image`, `/twitter-image`, HTML de rutas principales con `og:image` y `twitter:image`, ausencia de `/og-image.png`, TypeScript, lint enfocado y build.</validation>
  <validation_result>`/opengraph-image` y `/twitter-image` responden `200 OK` con `content-type: image/png`; la imagen Open Graph renderiza el logo MM y el texto `MMorera Agency` en 1200x630. El HTML de `/`, `/estudio`, `/sistemas` y `/casos-de-exito` incluye `og:image` y `twitter:image`; no queda referencia a `/og-image.png`. `pnpm exec tsc --noEmit`, lint enfocado de `layout.tsx`/rutas de imagen/componente social and `pnpm build` pasaron.</validation_result>
  <guardrails>
    <atomicity>No tocar contenido de paginas ni diseno interno del sitio; solo metadata e imagenes de preview.</atomicity>
    <brand>Usar `MMorera Agency` como texto visible y el logo MM actual como base visual.</brand>
    <security>No introducir secretos ni integraciones externas.</security>
    <git_hygiene>No revertir cambios existentes del usuario.</git_hygiene>
  </guardrails>
</social_share_image_mmorera_agency>

# Reporte de Auditoría Técnica & Plan de Alineación (Junio 2026)

Este plan resume el análisis solicitado por el usuario respecto a los cambios locales no commiteados y propone acciones específicas para limpiar la deuda técnica de linter y asegurar la estabilidad de la aplicación MMorera.

## Estado del Repositorio (Cambios Locales)

Hemos analizado el estado actual del espacio de trabajo. Se identificaron cambios significativos realizados por modelos anteriores que se encuentran en el working directory sin commitear.

### Hallazgos Principales:
1. **Compilación Correcta**: El comando `pnpm run build` compila al 100% de manera exitosa, generando las rutas estáticas y dinámicas clave (`/`, `/casos-de-exito`, `/sistemas`, `/estudio`, `/aplicar`).
2. **Uso de Tailwind CSS v4**: El proyecto fue actualizado a Tailwind v4 (`"tailwindcss": "^4"` y `"@tailwindcss/postcss": "^4"`). Aunque la recomendación original de InsForge aconsejaba mantener Tailwind v3.4, la migración ya se completó localmente, compila correctamente y no presenta regresiones.
3. **Escena 3D y Fondo Generativo**: Se introdujo Three.js (`@react-three/fiber`, `@react-three/drei`, `three`) y se creó un núcleo 3D dinámico interactivo al mouse (`OrchestrationCore.tsx`) para la home. También se reemplazaron los iconos flotantes decorativos del fondo por un campo generativo interactivo (`GenerativeField.tsx`).
4. **Simplificación Editorial**: Se completó la eliminación de bloques repetitivos e innecesarios en `/estudio` (`CreativeServices`, `ProcessFilm`, `CrossTrackBridge`) y en `/sistemas` (pricing, metrics, contact).
5. **Errores de Linter Activos**: El comando `pnpm lint` reporta **12 problemas (6 errores, 6 warnings)**. Los errores son causados por llamadas sincrónicas a `setState` dentro de `useEffect` (regla `react-hooks/set-state-in-effect`), que pueden gatillar renders en cascada innecesarios, además de un tipo `any` sin especificar.

---

## Propuesta de Cambios Quirúrgicos

Proponemos realizar una serie de micro-tareas para limpiar la deuda técnica del linter **sin alterar** los refinamientos visuales ni los componentes interactivos creados por los modelos anteriores.

### 🛠️ Corrección de Deuda de Linter (ESLint)

#### [MODIFY] [LanguageContext.tsx](file:///Users/mariomorera/Desktop/MMORERA/web/src/context/LanguageContext.tsx)
- Corregir el error `react-hooks/set-state-in-effect` en la línea 25. Silenciar la regla de forma explícita y documentada con `// eslint-disable-next-line react-hooks/set-state-in-effect` o reestructurar el efecto para que la asignación no dispare renders sincrónicos indebidos en el ciclo de hidratación.
- Cambiar el tipo `any` de la línea 47 por una declaración de tipos robusta basada en la estructura de `translations`.

#### [MODIFY] [TrackContext.tsx](file:///Users/mariomorera/Desktop/MMORERA/web/src/context/TrackContext.tsx)
- Corregir el error de ESLint en la línea 28 mitigando el set-state dentro del efecto, asegurando una hidratación limpia del track preferido.

#### [MODIFY] [portfolio-section.tsx](file:///Users/mariomorera/Desktop/MMORERA/web/src/components/sections/portfolio-section.tsx)
- Corregir la línea 280 para evitar el renderizado en cascada que reporta el plugin `react-hooks/set-state-in-effect`.

#### [MODIFY] [hero-section.tsx](file:///Users/mariomorera/Desktop/MMORERA/web/src/components/sections/hero-section.tsx)
- Remover las variables declaradas e imports que no se utilizan (`useRef`, `Network`, `HERO_CONTENT`), eliminando 3 warnings reportados por el linter.

---

## Preguntas Abiertas para el Usuario

> [!IMPORTANT]
> **¿Deseás que procedamos con las correcciones del linter?** Esto nos permitirá tener un build 100% verde (cero errores, cero warnings), facilitando la futura labor de despliegue y mantenimiento técnico sin afectar en nada la visual de las páginas.
>
> **¿Deseás levantar el servidor de desarrollo local (`pnpm dev`)** en segundo plano para poder explorar las rutas y el comportamiento de las animaciones en vivo en tu navegador?

---

---

## Plan de Verificación

Una vez aplicadas las correcciones propuestas:
1. Ejecutaremos `pnpm lint` en `web/` para confirmar que los 12 problemas han sido resueltos de forma exitosa (cero errores y warnings).
2. Ejecutaremos `pnpm run build` para asegurar la correcta generación estática de Next.js sin errores de tipado.

---

# Rediseño de Headers y Eliminación de Switcher Redundante

## Contexto y Diagnóstico (Pensamiento Lateral)
El sitio cuenta actualmente con múltiples capas de encabezados y switchers redundantes:
1. El **floating switcher** (`TrackSwitcher.tsx`) en la esquina superior izquierda que dice "DISEÑO" y "SOFTWARE".
2. El **menú de navegación inferior** (`Navbar.tsx`) que ya contiene links directos a `/estudio` y `/sistemas`.
3. Los **headers de página** que repiten el nombre de la sección en formato de "pills" genéricas de marketing.

Para eliminar esta fricción cognitiva sin perder la densidad estética (partículas, mesh y glows en el fondo) proponemos:
- **Remover el TrackSwitcher flotante**: La navegación del usuario por el menú inferior es suficiente. El estado del track se sincronizará automáticamente mediante el hook de ruta (`usePathname`) en `TrackContext.tsx`.
- **Reimaginar los Headers como un HUD Tecnológico**: En lugar de headers genéricos, diseñaremos una cabecera tipo "HUD / Workbench" técnica e integrada:
  - Líneas de grilla finas que conectan con el fondo.
  - Telemetría en tipografía mono (`Space Mono`): coordenadas activas (`ESTUDIO // DEP-01: CREATIVE`), estado (`STABLE // 100% ONLINE`), fps/resolución, latencia.
  - Mantener y densificar el campo de partículas/glows sutiles en el fondo del header para dar profundidad espacial.

## Cambios Propuestos

### [Estudio, Sistemas y Navegación]

#### [MODIFY] [TrackContext.tsx](file:///Users/mariomorera/Desktop/MMORERA/web/src/context/TrackContext.tsx)
- Sincronizar automáticamente el track según la ruta actual:
  - `/estudio` -> `'design'`
  - `/sistemas` -> `'software'`
- Esto nos permite deshacernos del selector manual flotante.

#### [MODIFY] [layout.tsx](file:///Users/mariomorera/Desktop/MMORERA/web/src/app/layout.tsx)
- Remover la importación y el renderizado de `<TrackSwitcher />` de la raíz del layout.

#### [MODIFY] [EstudioHero.tsx](file:///Users/mariomorera/Desktop/MMORERA/web/src/components/sections/EstudioHero.tsx)
- Reemplazar la pill genérica superior por un panel HUD horizontal con telemetría técnica (e.g. `TRACK: 01_CREATIVE_ESTUDIO // LATENCY: 0.0ms // CAM: ACTIVE // RENDER: DCI-P3`).
- Agregar un contenedor con grilla técnica sutil y micropartículas en el fondo para aumentar la densidad espacial.

#### [MODIFY] [page.tsx (sistemas)](file:///Users/mariomorera/Desktop/MMORERA/web/src/app/sistemas/page.tsx)
- Reemplazar la cabecera simple por el mismo lenguaje visual de HUD técnico (e.g. `TRACK: 02_SYSTEMS_OPS // STATUS: ACTIVE // ENGINE: N8N_WORKFLOW // DB: POSTGRESQL`).
- Añadir glows y grilla técnica integrada con partículas en el fondo del hero.

#### [MODIFY] [PortfolioGrid.tsx](file:///Users/mariomorera/Desktop/MMORERA/web/src/components/portfolio-isolated/PortfolioGrid.tsx)
- Reestructurar el header de `/casos-de-exito` con el mismo formato HUD (e.g. `TRACK: 03_COMPILED_CASES // TELEMETRY: LIVE_COMPILATION // STACK: AGENTIC`).
- Mantener y mejorar el swapper de vistas (`Media Pool` / `VS Code`) para que quede alineado con el nuevo HUD.

## Plan de Verificación
1. Validar el funcionamiento en local: recargar las rutas `/estudio`, `/sistemas` y `/casos-de-exito`.
2. Confirmar que la navegación inferior ordena los ítems de acuerdo al track actual de forma automática.
3. Asegurar que los headers se visualizan correctamente en desktop y mobile (Mobile-First) sin overflow horizontal.
4. Correr `pnpm run build` y `pnpm lint`.

---

# Eliminación de Consolas en Vivo y Simplificación

## Contexto y Diagnóstico (Pensamiento Lateral)
El usuario solicita remover "las consolas en vivo" y simplificar el sitio. Identificamos dos consolas/simulaciones interactivas en vivo en la aplicación:
1. **Consola de Diagnóstico en Sistemas** (`SistemasBlueprint.tsx`): Una simulación de terminal que muestra logs vivos de eventos y payloads JSON a nivel de base de datos/API. Genera mucho peso visual y alarga la página `/sistemas`.
2. **Consolas Animadas del Hero de Home** (`HeroPortfolio.tsx`): Los visualizadores interactivos (VU Meter, terminal de Next build, monitor de latencia HTTP) ubicados dentro de las tarjetas del hero de la home.

Para simplificar el sitio conservando el estilo de grillas, mesh y partículas:
- **En `/sistemas`**: Removeremos por completo la consola de diagnóstico (`System Diagnostics Terminal` y sus logs) de la parte inferior de `SistemasBlueprint.tsx`. Mantendremos el gráfico de nodos del circuito que es claro y didáctico.
- **En la Home (`HeroPortfolio`)**: Eliminaremos los visualizadores de consola interactivos (`VuMeter`, `TerminalBuild`, `NetworkMonitor`) de las tres tarjetas del hero. Las tarjetas pasarán a mostrar directamente sus títulos, separadores y listas de herramientas, reduciendo ruido visual e interactivo innecesario.

## Cambios Propuestos

### [Sistemas y Home]

#### [MODIFY] [SistemasBlueprint.tsx](file:///Users/mariomorera/Desktop/MMORERA/web/src/components/portfolio-isolated/SistemasBlueprint.tsx)
- Eliminar el bloque de JSX que renderiza la terminal de logs/telemetría y JSON (líneas 411 a 533).
- Eliminar el estado de logs vivos (`liveLogs`), referencias (`liveLogsContainerRef`, `logIdCounter`), y la función de coloreado JSON `HighlightedJSON`.
- Mantener intacto el flujo interactivo de los nodos en la parte superior (gráfico de circuito e información de latencia integrada).

#### [MODIFY] [HeroPortfolio.tsx](file:///Users/mariomorera/Desktop/MMORERA/web/src/components/portfolio-isolated/HeroPortfolio.tsx)
- Eliminar las funciones y componentes `VuMeter`, `TerminalBuild` y `NetworkMonitor` (líneas 72 a 224).
- Quitar el renderizado de estos componentes en `TrackCard` (líneas 285 a 290).

## Plan de Verificación
1. Iniciar servidor local (`pnpm dev`) y verificar visualmente en el navegador:
   - La página `/sistemas` ya no muestra la consola de logs al final del blueprint.
   - El hero de la home tiene tarjetas simplificadas (sin simuladores de consola activos).
2. Ejecutar `pnpm run build` para asegurar la compilación.
3. Ejecutar `pnpm lint`.

