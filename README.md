# Piedra • Papel • Tijera • Lagarto • Spock

Juego web minimalista hecho con TypeScript y HTML/CSS. Incluye animación tipo tragamonedas para la elección de la PC, confeti en las victorias y sonidos sutiles para ganar/perder/empatar.

## Características
- UI limpia y responsiva
- Elección aleatoria de la PC
- Contadores: Jugador, Empates y PC
- Resultado visual “VS” con emojis grandes
- Animación de “slot machine” al elegir la PC
- Confeti cuando gana el jugador
- Sonidos (Web Audio API) para ganar, perder y empatar

## Requisitos
- Node.js 18+ (recomendado) y npm

## Instalación
```bash
npm install
```

## Ejecutar en local
Compilar TypeScript a `public/main.js`:
```bash
npm run build
```
Abrir el juego en el navegador:
```bash
open public/index.html
```
Modo desarrollo (recompila al guardar):
```bash
npm run watch
```

> Nota: No hay servidor de desarrollo; basta con abrir `public/index.html`. Si prefieres, puedes servir la carpeta `public/` con cualquier servidor estático.

## Scripts disponibles
- `npm run build`: compila TypeScript → `public/`
- `npm run watch`: compila en modo watch

## Estructura del proyecto
```
public/
  index.html   # Archivo HTML principal
  style.css    # Estilos minimalistas
  main.js      # Salida compilada desde TypeScript (no editar a mano)
src/
  main.ts      # Lógica del juego y render de la UI
package.json
tsconfig.json
```

## Personalización rápida
- Colores/estilos: editar variables y clases en `public/style.css` (ver `:root` y bloques `.duel*`, `.message`, etc.)
- Emojis y reglas: en `src/main.ts`, arreglo `opciones` (por ejemplo cambiar íconos o relaciones de victoria)
- Sonidos: función `playSound(...)` y helper `tone(...)` en `src/main.ts` (frecuencias, forma de onda, volumen y duración)
- Duración de la animación de la PC: parámetro `durationMs` en `spinPC(...)`

## Despliegue en GitHub Pages
Este repo genera los archivos estáticos en `public/`. Para publicar con GitHub Pages:
1. Haz push del repositorio a GitHub
2. En GitHub: Settings → Pages
3. “Source”: selecciona “Deploy from a branch”
4. Branch: `main` (o el que uses) y Folder: `/public`
5. Guarda. En unos minutos estará disponible tu sitio

## Accesibilidad
- Botones con `aria-label`
- Lectura de marcador con `aria-live="polite"`

## Licencia
ISC (ver `package.json`)

---
Si deseas migrar estilos a Tailwind o agregar persistencia de marcador (LocalStorage), se puede integrar fácilmente.
