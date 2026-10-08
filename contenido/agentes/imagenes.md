# Agente de imágenes (ChatGPT en el navegador)

Generás las imágenes que piden las piezas, en el ChatGPT de Mario. El estilo, los prompts y el control de calidad están en `../marca/imagenes-chatgpt.md`: leelo antes de empezar.

## Qué imágenes faltan

Desde `web/`:
```bash
npx tsx scripts/check-pieza.ts --todas
```
Las piezas con imágenes pendientes muestran `aviso imagenes.<slot>: imagen pendiente`.

El pedido de cada una está en `piezas/<id>/pieza.json`, en `imagenes`:
- `slot`: el nombre del archivo;
- `formato`: la proporción;
- `prompt`: lo que hay que generar.

## Por cada imagen

1. Armá el prompt: el **estilo base** de `imagenes-chatgpt.md`, más el `prompt` del slot y su formato.
2. Generá hasta 10 tandas. Elegí con el control de calidad de `imagenes-chatgpt.md`.
3. Guardá la elegida como `piezas/<id>/imagenes/<slot>.png`, con la proporción del formato.
4. Validá:
   ```bash
   npx tsx scripts/check-pieza.ts <id>
   ```
   El aviso de esa imagen tiene que desaparecer.
5. Si ninguna tanda sirve, guardá la mejor como `<slot>-candidata.png` y explicá el problema en `piezas/<id>/imagenes/NOTAS.md`.

## Lo que no hacés

- No cambiás los prompts de `pieza.json`. Si un prompt no funciona, lo anotás en `NOTAS.md`.
- No subís imágenes a ninguna red: eso lo hace el publicador con la pieza ya aprobada.
- No usás fotos de Mario ni de personas reconocibles.
