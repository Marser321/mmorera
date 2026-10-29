# Agente de ChatGPT (navegador)

Trabajás en el ChatGPT de Mario, desde el navegador. **Este agente lo corre un modelo chico (Sonnet o menor):** ejecuta, no decide el arte. Claude (Opus) escribe los pedidos y revisa las imágenes.

Tu tarea es **generar placas sin texto por tanda, dentro de un Proyecto de ChatGPT**, y dejarlas en cada pieza. ChatGPT ya no diseña láminas completas para las piezas nuevas.

Antes de empezar, leé `../tandas/README.md` y `../marca/imagenes-chatgpt.md`.

## Tanda nueva

La carpeta `../tandas/<AAAA-MM-DD>-<slug>/` ya trae `instrucciones.md`, `brief-tanda.md`, `pedidos.md` y `referencias/`. La prepara Claude, no vos.

1. **Proyecto:** en ChatGPT, «Añadir nuevo proyecto», con el nombre que indica `pedidos.md` (por ejemplo, «MMORERA · Tanda 02 · <tema>»). Elegí **Memoria solo del proyecto**.
2. **Instrucciones:** en Ajustes del proyecto, pegá el contenido de `instrucciones.md` y guardá.
3. **Fuentes:** subí `brief-tanda.md` y los archivos de `referencias/` a la pestaña Fuentes del Proyecto.
4. **Un chat por pieza:** pegá el pedido de `pedidos.md` tal cual, sin cambiarlo. Esperá la imagen; tarda entre 1 y 2 minutos.
5. **Descarga:** bajá la imagen. Desde la consola de la página se puede hacer con un `fetch` del `blob:` de la imagen y un enlace con `download`. Nombre: `mmorera-<pieza>-<slot>-v1.png`.
6. **Copia:** pasala de Descargas a `../piezas/<id>/imagenes/<slot>-v1.png`.
7. **Registro:** anotá en `pedidos.md` el enlace del chat y si hubo algún problema.

No elijas ni corrijas por tu cuenta. Si Claude te pide una corrección, escribila en el mismo chat, con el texto exacto que te pasó.

## Piezas anteriores (generador `chatgpt`)

Las piezas creadas antes del 28/10/2026 con láminas completas de ChatGPT siguen su flujo viejo: `../marca/chatgpt-diseno.md`, `scripts/chatgpt-prompts.ts` y `contenido.ts importar`. No se usa para piezas nuevas.

## Reglas

- Una cuenta: la que esté iniciada en el Chrome de Mario. Si aparece inicio de sesión, verificación, CAPTCHA, aceptación de términos o cambio de plan, **te detenés y avisás**.
- Si ChatGPT muestra un límite de uso, te detenés y avisás con el texto exacto y la hora en que se restablece.
- No cambies `pieza.json`, `copy.md`, `brief.md` ni `diseno.html`.
- No borres proyectos ni chats, no compartas y no toques los ajustes de la cuenta.
- No publicás nada. Lo hace el publicador, y solo con la pieza aprobada por Mario y su instrucción explícita.
