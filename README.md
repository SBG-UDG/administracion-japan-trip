# Tokio en 15 días

Sitio de venta de un viaje a Tokio para **3 adultos + 1 niño de 12 años**, con salida desde **Guadalajara (GDL)**, **15 días / 14 noches** con base fija y un plan extra de **cinco ciudades**.

Cuatro productos, cuatro precios por adulto y una sola regla: cada cifra se puede auditar.

| Producto | Precio por adulto | Niño de 12 | Grupo 3+1 | Por día / persona |
|---|---:|---:|---:|---:|
| Turista · solo terreno | $25,000 | $11,845 | $86,845 | $1,447 |
| Turista · con vuelo | $45,010 | $31,855 | $166,885 | $2,781 |
| Clase media | $75,000 | $51,427 | $276,427 | $4,607 |
| Clase alta | $150,000 | $113,340 | $563,340 | $9,389 |
| Asian Tour | $150,000 | $112,860 | $562,860 | $6,701 |

**Ventana:** 15 feb – 1 mar 2027 (Tokio); 15 feb – 7 mar 2027 (Asian Tour).
**Consulta de tarifas:** 22/10/2026.
**Tipo de cambio:** ¥1 = $0.1165 MXN; USD 1 = $18.4253 MXN (Banxico, 19 y 21/10/2026).

---

## 1. Qué hay en el repositorio

| Archivo | Para qué |
|---|---|
| `index.html` | Sitio principal. `index.html` está en la raíz, como exige GitHub Pages. |
| `styles.css` | Diseño del sitio. Sin fuentes ni imágenes externas. |
| `precios.js` | **Único bloque de datos**: precios, categorías, itinerarios, hoteles, vuelos, fuentes, riesgos, FAQ y créditos. |
| `app.js` | Selector, fichas, comparador, ledger, mapa de Asia, fuentes y FAQ. |
| `anexo.html` / `anexo.css` / `anexo.js` | Anexo imprimible de fuentes y modelo de costos (D3). |
| `guion-presentacion.md` | Guion de 3 bloques, 7–10 minutos, con marcas de tiempo, frases de enlace, Q&A y bitácora de ensayos. |
| `assets/favicon.svg` | Ícono local. |
| `respaldo/` | PDF del sitio completo, capturas de las cuatro opciones y capturas extra. |
| `tools/verificar.py` | Verificador de aritmética y referencias de fuentes. |
| `.github/workflows/pages.yml` | Publicación automática en GitHub Pages. |
| `.nojekyll` | Evita que Jekyll ignore archivos. |
| `reference/` | Material histórico del equipo. No forma parte del sitio nuevo. |

Todo el sitio es **HTML, CSS y JavaScript estáticos**. No hay backend, base de datos, build obligatorio ni CDNs críticos. Funciona abierto con doble clic (`file://`) y sin internet.

---

## 2. Abrirlo en local

1. Abre `index.html` con doble clic.
2. O, si prefieres un servidor local:
   ```bash
   python3 -m http.server 8000
   ```
   y visita `http://localhost:8000/`.
3. Para proyectar un nivel directo:
   - `index.html#turista`
   - `index.html#media`
   - `index.html#alta`
   - `index.html#asia`

El selector también actualiza la URL al hacer clic. En `file://` funciona con respaldo de `location.hash` si el navegador bloquea `history.pushState`.

---

## 3. Cambiar datos

Todo está en `precios.js`. No hace falta tocar el HTML.

- **Nombres del equipo y créditos:** al inicio del archivo, en `meta.equipo` y `meta.integrantes`. Están vacíos a propósito: el equipo los escribe; el sitio no inventa nombres.
- **Precios y rubros:** en `productos.*.categorias`. Cada rubro tiene `adulto`, `factorNino` y `fuentes`.
- **Itinerarios:** en `productos.*.itinerario`.
- **Hoteles y vuelos:** en `productos.*.hotel` y `productos.*.vuelos`.
- **Fuentes:** en `fuentes`, con `n`, `grupo`, `titulo`, `url`, `fecha`, `uso`.
- **Riesgos y FAQ:** en `riesgos` y `faq`.

Después de cambiar una cifra, corre:

```bash
python3 tools/verificar.py
```

El verificador comprueba:

- suma de rubros = precio por adulto;
- suma de rubros = precio del niño;
- 3 × adulto + niño = total del grupo;
- total ÷ días ÷ 4 = costo por día por persona;
- día típico suma exacto;
- Turista con vuelo cuadra;
- Asia está entre $135,000 y $165,000;
- todas las referencias a fuentes existen;
- las cinco ciudades están en el orden decidido y suman 20 noches.

---

## 4. Publicar en GitHub Pages

El sitio ya está publicado en:

**https://sbg-udg.github.io/administracion-japan-trip/**

La publicación usa la rama **`gh-pages`**, que GitHub Pages detectó y activó al crearla. El workflow de `main` mantiene esa rama actualizada:

- Archivo: `.github/workflows/pages.yml`.
- Se dispara con cada push a `main` o manualmente desde **Actions**.
- El paso “Preparar solo los archivos públicos” copia `index.html`, CSS, JS, `assets/` y `respaldo/` a `sitio-publicado/`; el resto del repositorio (incluidas las instrucciones internas y `reference/`) no se publica.
- `peaceiris/actions-gh-pages` publica ese directorio en `gh-pages`, con `force_orphan`.
- No hay paso manual después de publicar.

Si en el futuro Pages se desactiva:

1. Ve a **Settings → Pages**.
2. En **Build and deployment**, elige **Deploy from a branch**.
3. Branch: **`gh-pages`**; carpeta: **`/ (root)`**.
4. Guarda y espera el despliegue.

Verificación después de publicar:

- [ ] Abre la URL en una ventana de incógnito.
- [ ] Ábrela en el celular.
- [ ] La consola no muestra 404.
- [ ] El selector cambia las cuatro opciones.
- [ ] `#turista`, `#media`, `#alta` y `#asia` abren el nivel correcto.
- [ ] Abre `index.html` desde `file://` y el selector sigue funcionando.
- [ ] `anexo.html` abre y se imprime.

## 5. Qué se decidió y qué se declara

- **Destino:** Tokio, no un circuito por Japón. Base fija en la ciudad; profundidad con barrios y salidas de un día (Nikko, Kamakura, Hakone, Yokohama y la zona del Fuji). Es una interpretación del equipo.
- **Viajeros:** 3 adultos + 1 niño de 12. La edad es firme: a los 12 se paga tarifa adulta en vuelo y metro; el ahorro está en el hotel y algunas atracciones.
- **Presupuesto más bajo:** $25,000 por persona. **No alcanza para el vuelo**: la tarifa más barata con maleta cuesta $20,010. Por eso el paquete turista es **solo terreno**; con vuelo cuesta $45,010. Está dicho en la portada, en la ficha y en el FAQ.
- **Presupuesto más alto:** $150,000 por persona, todo incluido.
- **Asian Tour:** $150,000 por adulto, dentro de la banda $135,000–$165,000; cinco ciudades en orden Tokio → Seúl → Bangkok → Hanói → Singapur, con regreso desde Singapur (*open jaw*). El grupo paga $562,860; el costo por día baja a $6,701.
- **Aéreo:** escalas permitidas y bienvenidas. Cada tramo indica aerolínea, escalas y duración. No existe GDL–Tokio sin escala.
- **Transporte:** no se cotiza un JR Pass nacional con base fija en Tokio. Se usan pases locales y de un día.
- **Habitaciones:** turista, cuádruple real; media, triple + individual; alta, dos deluxe; Asia, dos habitaciones por ciudad.
- **Visas:** Japón y Singapur sin visa; Corea K-ETA; Vietnam e-visa; Tailandia **sí requiere visa desde el 15/09/2026**. Todo con fecha y fuente.
- **Moneda:** precios en MXN; conversión a yenes con tipo de cambio citado y fechado.

---

## 6. Límites y advertencias

- **Las tarifas son volátiles.** Se consultaron el 22/10/2026 y no son una reserva. Se congelan con el anticipo del 30%.
- **La visa tailandesa es el riesgo más grande del Asian Tour.** Puede tardar y requiere estados de cuenta, reservas y comprobantes. Si se niega, el plan no se opera y se devuelve la parte no incurrida.
- **Corea:** la exención de K-ETA está vigente hasta el 31/12/2026. Para febrero de 2027 se presupuesta la K-ETA (KRW 10,000). Verificar la extensión 30 días antes.
- **Hoteles:** las tarifas son de referencia y están sujetas a disponibilidad. La combinación de habitaciones cotizada existe, pero no está bloqueada.
- **Tipo de cambio:** un +10% del yen mueve el grupo entre $7,800 y $27,900 según el producto. El colchón de 3.3–6.6% absorbe el primer golpe; el precio se firma en pesos con tope de 10%.
- **Ensayos:** la bitácora de `guion-presentacion.md` está preparada, pero los dos ensayos cronometrados los hace el equipo. El agente no puede ensayar en su lugar.
- **Nombres:** faltan los tres integrantes y el nombre del equipo. Se escriben en `precios.js` → `meta.integrantes` y `meta.equipo`. No se inventaron.

---

## 7. Accesibilidad y rendimiento

- Navegación por teclado: `Tab`, flechas en el selector, `Home`/`End`, `Escape` en el menú móvil.
- Estados de foco visibles (`:focus-visible`, 3 px).
- Selector con `role="tablist"`, `aria-selected`, `tabindex` móvil y panel `role="tabpanel"`.
- Anuncio `aria-live` con el resumen del producto.
- Contraste alto; tipografía grande para proyector 16:9 y celular.
- `prefers-reduced-motion` respetado.
- Sin fotos de stock: el diseño es tipográfico, con trazos y un sello propios.
- Sin CDNs, sin fuentes externas, sin secretos.
- Imágenes locales y ligeras; el PDF de respaldo pesa ~630 KB.

---

## 8. Créditos

El bloque de créditos está preparado en el sitio y en `precios.js`. Para completarlo:

```js
// precios.js
"meta": {
  "equipo": "Nombre del equipo",
  "integrantes": ["Nombre 1", "Nombre 2", "Nombre 3"],
  ...
}
```

No se usaron nombres inventados ni iniciales.
