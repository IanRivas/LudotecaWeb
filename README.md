# Entre turnos · Ludoteca
Catálogo personal construido con React y Vite.

## Iniciar
Requiere Node.js 22.12 o superior.

```sh
npm install
npm run dev
```

Abrí la dirección que indique Vite. Para generar la versión de producción: `npm run build`. Para verla localmente: `npm run preview`.

## Juegos
La fuente de datos es `ludoteca.json` en la raíz. Cada juego se muestra mediante `src/components/GameCard.jsx`. La grilla usa tres columnas en escritorio, dos en tablet y una en celular.

- `minPlayers` / `maxPlayers`: cantidad admitida de jugadores.
- `bestMinPlayers` / `bestMaxPlayers`: cantidad ideal.
- `played`: estado jugado o por estrenar.
- `image`: URL de una imagen o ruta como `/images/juego.jpg` (archivo en `public/images/`). Si falta o falla, se muestra una portada tipográfica decorativa.
- `category`: arreglo opcional, por ejemplo `["Estrategia", "Cooperativo"]`. Se muestran etiquetas y aparece automáticamente el selector de categorías cuando haya datos.

El filtro «Para 2» incluye cualquier juego cuyo rango admita dos personas; no significa que sea exclusivamente para dos ni que dos sea su cantidad ideal. Los filtros se combinan con búsqueda por nombre (sin distinguir tildes) y ordenamiento. Los datos originales se conservan sin asignar categorías inventadas.

La búsqueda y los filtros viven en `src/App.jsx`; los estilos y puntos de adaptación están en `src/styles.css`. No requiere backend. Las fuentes de Google son opcionales: hay fuentes locales de respaldo.

## Expansiones pendientes
El campo booleano `unplayedExpansion` indica que el juego tiene alguna expansión sin jugar. Si es `true`, la tarjeta muestra un aviso y el juego se incluye al activar «Con expansión sin jugar». Este filtro se combina con categoría, búsqueda y las pestañas. El contador indica juegos con alguna expansión pendiente, no cantidad de expansiones. El estado `played` del juego base se mantiene independiente.
