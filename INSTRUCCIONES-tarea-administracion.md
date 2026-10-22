# Tarea de Administración — Sitio de venta: “Tokio en 15 días”

> Documento de encargo. Va dirigido al agente que construya el trabajo.
> Describe **qué hay que entregar y bajo qué reglas**. No describe decisiones ya tomadas sobre contenido, estilo ni cifras: eso se decide al ejecutar, respetando las reglas de la sección 7.
> No hay preguntas abiertas: los parámetros de la §2 están cerrados. Lo único que el agente no decide son los nombres de los integrantes, que los pone el equipo (ver §9).

---

## 1. El encargo (lo que pidió el profesor)

Trabajo **en equipo**. Consigna, en orden:

1. **Planear un viaje a Japón de 15 días.** → El equipo **acota el destino a Tokio**: el viaje es a Tokio, no un circuito por Japón (ver §2).
2. **Tres niveles de presupuesto:** turista, clase media, clase alta.
3. **Paquetes con actividades y/o destinos, ± una cantidad** — cada nivel debe diferenciarse por *profundidad de viaje* (qué se hace, a dónde se llega, cuántas experiencias entran), no solo por categoría de hotel. Un paquete es un producto cerrado, no una lista de ciudades.
4. **Se presenta y se tiene que vender.** Doble objetivo: que se sostenga académicamente y que convenza como oferta comercial.
5. **Formato libre:** página web, presentación o video. → **Decidido: sitio web.**
6. **Plan extra: “Asian tour”**, montado sobre el presupuesto alto.

Notas internas del equipo que **no forman parte de la consigna** y no deben aparecer en el sitio ni en la presentación: la fecha de entrega y el dato de los equipos ganadores.

---

## 2. Parámetros del caso

Fijados por el equipo; el agente **no los cambia**, solo los aplica y los declara:

- **Destino: Tokio, 15 días (14 noches), con base fija en la ciudad.** No es un circuito: no se cambia de hotel cada tres días. La profundidad del paquete se construye con **barrios + salidas de un día** (Nikko, Kamakura, Hakone, Yokohama, la zona del Fuji). Esa lectura es una **interpretación** del equipo: si el profesor esperaba un recorrido nacional, se ajusta, pero el producto que se vende es Tokio con excursiones.
- **Viajeros: 3 adultos + 1 niño de 12 años.** Cuatro personas, no tres. La edad es dato firme, no aproximado: úsala tal cual para tarifas infantiles de transporte y atracciones.
- **Presupuesto más bajo: $25,000 MXN. Presupuesto más alto: $150,000 MXN. Ambos POR PERSONA.** No son montos del grupo. Como hay un niño, el sitio debe publicar tres cifras distintas y nunca confundirlas:
  1. **precio por adulto** (la que corresponde al nivel de presupuesto),
  2. **precio del niño** y con qué factores se calculó,
  3. **total del grupo de 4**, que es la suma real.
  Un promedio simple “por persona” del grupo oculta el descuento infantil: si se usa, se etiqueta como promedio, no como precio de lista.
- **Salida desde Guadalajara (GDL).**
- **Escalas: permitidas y bienvenidas.** Las tarifas deben ser las más baratas reales, aunque impliquen 1 o 2 escalas y 20–30 h de viaje. No se cotiza “vuelo directo”: no existe GDL–Tokio sin conexión. Cada tarifa debe indicar **número de escalas, aeropuerto de conexión y duración total**, porque la escala es justamente el argumento que hace viable el paquete turista.
- **Moneda:** pesos mexicanos (MXN) como moneda de decisión; conversión a yenes con **tipo de cambio citado y fechado**.
- **Ventana de viaje:** no la fija el brief. Elegirla y justificarla por clima, temporada y precio; declarar la fecha de consulta de cada tarifa.
- **Idioma del sitio y de la presentación:** español (México).

### El plan Asia y su regla de precio

- **El Asian tour se vende al precio por persona del presupuesto más alto, ± una cantidad que no exceda $15,000 MXN por persona.** Con el techo en $150,000 pp, el plan Asia tiene que cerrar **entre $135,000 y $165,000 MXN por persona adulto**. Esa banda es la restricción dura del producto: si una escala la revienta, se cambia la escala, no la banda.
- **Ruta decidida, cinco ciudades: Tokio → Seúl → Bangkok → Hanói → Singapur.** Cinco ciudades en cinco países, en ese orden. **No se recorta la lista:** si la aritmética no cabe en la banda, se ajusta lo que sí es flexible —noches por ciudad, categoría de hotel, clase tarifaria del vuelo, número de actividades pagadas— hasta que cierre. Solo si con esas palancas es matemáticamente imposible, se deja fuera una ciudad y se justifica con números; la lista de cinco es el producto.
- La ruta se recorre **en un solo sentido**, saliendo de GDL hacia Tokio y regresando desde Singapur. No se vuelve a Tokio: el tramo de regreso se cotiza como *open jaw*, no como ida y vuelta al primer destino.
- El plan Asia **no es “lo mismo pero mejor”**: gasta el mismo dinero en más ciudades y más días, y necesariamente baja la comodidad por destino. Ese intercambio se muestra en una tabla **“lo que se gana / lo que se pierde”** contra el paquete de clase alta.

---

## 3. Entregables

| # | Entregable | Notas |
|---|---|---|
| D1 | **Sitio web publicado en GitHub Pages**, con URL pública | Es el entregable principal y también el apoyo visual de la presentación |
| D2 | **Presentación oral en equipo** usando el sitio en vivo | Guion por bloque, con tiempos (ver §6) |
| D3 | **Anexo de fuentes y modelo de costos** | Página dentro del sitio + versión imprimible, para el Q&A |

---

## 4. El sitio: qué debe ser

**Un sitio de venta de viajes, tipo agencia / landing comercial.** No un documento escolar con pestañas. El visitante debe poder *comprar* mentalmente el viaje en menos de un minuto y luego auditar cada peso.

Contenido mínimo:

- **Portada / hero:** propuesta de valor en una línea, “desde $X por persona”, quiénes viajan (3 adultos + 1 niño), duración, llamada a la acción. Sin párrafos de relleno.
- **Selector de presupuesto:** control visible y persistente con cuatro opciones — **turista / clase media / clase alta / Asia tour**. Al cambiar, se actualizan en vivo (sin recargar): itinerario, qué incluye, hospedaje, transporte, actividades, precio por adulto, precio del niño, total del grupo y costo por día por persona. La opción activa debe quedar reflejada en la URL (`#turista`, `#media`, `#alta`, `#asia`) para poder proyectar directo un nivel.
- **Ficha de cada paquete:**
  - Itinerario **día por día**: 15 días con base en Tokio, y el equivalente del plan Asia con sus noches por ciudad.
  - Qué incluye y qué **no** incluye, en lista explícita. El “no incluye” vende confianza.
  - Hospedaje por zona de Tokio (no “Tokio” a secas: el barrio es parte del producto) y tipo de habitación **para 4 personas** — cuádruple, triple + individual o dos cuartos. Decirlo, porque es donde se rompen los presupuestos.
  - Transporte, alimentación, atracciones con nombre propio, y qué salidas de un día entran en cada nivel.
  - Para cada tramo aéreo: aerolínea, escalas, duración total.
  - Precio por adulto, precio del niño, total del grupo, y **costo por día por persona**.
  - Un “día típico” desglosado, para que el precio se sienta real.
- **Comparador** de los tres niveles lado a lado, por rubro.
- **Sección de transparencia / aritmética:** cómo se llegó a cada total, en qué se fue el dinero (proporción vuelo / hospedaje / comida / transporte / actividades), tipo de cambio usado y fecha. Esta sección es la que gana el Q&A.
- **Asia Tour:** mapa o secuencia de las cinco ciudades con noches en cada una, y la tabla “gana / pierde”.
- **Riesgos y política:** tipo de cambio, temporada alta, **visas por país de la ruta asiática**, cancelación, esquema de pago.
- **Fuentes:** lista con URL, fecha de consulta y para qué cifra se usó cada una.
- **FAQ / objeciones:** “¿por qué el vuelo tarda 28 horas?”, “¿por qué el paquete barato no sale de Tokio?”, “¿qué visa necesito para cada país?”, “¿cómo duermen cuatro?”.

Forma:

- Responsive. Se va a ver en **proyector 16:9** y en celular; ambas tienen que verse bien.
- Tipografía grande y contraste alto: legible desde el fondo del salón.
- Navegación por teclado y estados de foco visibles.
- Sin fotos de stock genéricas que no correspondan al itinerario; mejor sin foto que con foto falsa.

---

## 5. Requisitos técnicos: GitHub Pages (obligatorio)

- **100% estático:** HTML, CSS y JavaScript. Sin backend, sin base de datos, sin procesos en servidor. Se permite un build local (Vite, Astro, Eleventy…) **solo** si el resultado desplegado son archivos estáticos.
- **`index.html` en la raíz del repo** (o en `/docs`, configurando Pages así). Nada de depender de un paso manual después de publicar.
- **Todas las rutas relativas.** Si es *project site* (`usuario.github.io/repo/`), una ruta absoluta tipo `/assets/x.css` rompe el sitio. Además **las rutas distinguen mayúsculas**: `Img/Hero.webp` ≠ `img/hero.webp`.
- **Nada de carpetas ni archivos que empiecen con `_`** (Jekyll los ignora en silencio) a menos que se agregue un archivo `.nojekyll` en la raíz.
- **Sin secretos.** Cero API keys, tokens o credenciales en el repo. Si se consultan precios o tipo de cambio, se hace durante el desarrollo y se **hardcodea el valor con su fecha**.
- **Datos separados del diseño:** todos los precios, itinerarios y totales en un solo bloque (`precios.js` o `data.json`). El selector recalcula en cliente desde ahí. Así se corrige una cifra sin tocar el HTML y cualquiera puede auditar el modelo.
- **Sin routing que se rompa al recargar.** Una sola página con anclas o multipágina donde cada HTML se abra directo. Nada de rutas que solo funcionen navegando.
- **Debe funcionar abierto con doble clic (`file://`)**, con internet o sin él. Si el salón no tiene red o Pages falla, se presenta desde una copia local; si el sitio depende de CDNs, ese plan se cae.
- **Fuentes e imágenes locales.** Nada crítico servido desde un CDN. Imágenes comprimidas (ideal <300 KB cada una, WebP), sin video pesado.
- **Límites de Pages:** repo <1 GB, archivo individual <100 MB.
- **Verificación antes de decir “listo”:** la URL carga en incógnito; carga en celular; consola sin 404; el selector cambia las cuatro opciones; cada ancla abre en el nivel correcto; funciona desde `file://`.

---

## 6. La presentación: 7–10 minutos, tres personas, tiempo parejo

El equipo son **3 integrantes** (Fodd + 2 compañeros). Requisito explícito: **los tres deben hablar una cantidad de tiempo similar**. Nada de un orador que hace el 80% y dos que leen una diapositiva.

- **Duración total: 7 a 10 minutos.** Reparto: **3 bloques de 2:20 a 3:20 cada uno**, y el bloque más largo y el más corto no deben diferir en más de 30 segundos. Si se apunta al centro, **8 minutos**: ~2:40 por persona. Ensayar dos veces la versión de 7 y una la de 10; el objetivo real es aterrizar en 8–9.
- Con ese presupuesto de tiempo **no hay espacio para leer el sitio**: se muestra y se señala, no se recorre completo. Cada bloque cubre 2 o 3 ideas, no cinco.
- **Estructura en tres actos de peso equivalente**, cada uno con dueño:
  - **A — El problema y la propuesta:** por qué Tokio y no un circuito por Japón, a quién le vende, y la aritmética de los presupuestos (por persona, con niño, y por qué la escala hace viable el paquete barato).
  - **B — Los productos:** recorrido del sitio con el selector en vivo, un nivel por vez, con el itinerario y el precio por día.
  - **C — Asia Tour, riesgos y cierre comercial:** el plan extra, la banda de precio, el “gana/pierde”, las objeciones y el cierre.
- **Cada bloque termina con una frase de enlace** al siguiente orador, para que el cambio no cueste segundos ni “eh… bueno, ahora”.
- **Regla de Q&A:** cada integrante debe poder responder su bloque **y** la pregunta de aritmética, porque el jurado no elige a quién preguntarle.
- **Guion con marcas de tiempo por bloque** y al menos **dos ensayos cronometrados**. Si un bloque se pasa, se recorta contenido, no se acelera la voz.
- **Presentación en vivo del sitio.** Respaldo obligatorio: PDF del sitio completo y capturas de las cuatro opciones, por si falla la red o la proyección.
- Los tres deben haber visto el sitio completo al menos una vez, no solo su parte.

---

## 7. Reglas de contenido (no negociables)

1. **Ninguna cifra sin fuente, fecha de consulta y una multiplicación que cuadre.** Esto se declara en el sitio, no solo se cumple.
2. **Todo supuesto, escrito:** tipo de cambio y fecha, temporada y ventana de viaje, número de noches, factores de precio infantil para un niño de 12, colchón para imprevistos.
3. **Coherencia aritmética:** la suma de rubros da el total; el total se descompone en 3 adultos + 1 niño (no se divide simplemente entre cuatro); el costo por día sale del total entre días y viajeros. Si un número no cuadra, se corrige antes de publicarlo.
4. **Si el presupuesto más bajo no alcanza para el vuelo** (verificarlo con tarifa real y fecha, con escalas), decirlo explícitamente en el sitio y definir el alcance del paquete en consecuencia: solo terreno o todo incluido. La transparencia es parte del pitch; que el jurado descubra el hueco es lo que hunde al equipo.
5. **Diferenciación real entre niveles:** con base fija en Tokio, la diferencia está en barrio del hotel, cuántas salidas de un día entran, qué experiencias se pagan (guía, gastronomía, entradas con nombre) y qué transporte se usa. No es el mismo itinerario con otro hotel.
6. **Transporte coherente con la ruta:** con base fija en una ciudad, no se cotiza un pase ferroviario nacional por default; se cotiza lo que de verdad conviene para Tokio y sus salidas. Un pase mal elegido es el error de novato que el jurado detecta en dos preguntas.
7. **El plan Asia respeta la banda de $150,000 ± $15,000 por persona adulto** y el orden Tokio → Seúl → Bangkok → Hanói → Singapur, con las cinco ciudades. Si la aritmética se sale de la banda, se recortan noches, categoría de hotel y clase de vuelo antes que ciudades; nunca se publica un total fuera de banda sin explicarlo.
8. **Visas: verificar país por país para pasaporte mexicano antes de escribir una sola línea al respecto.** La ruta toca cinco países con régimen distinto y cada uno debe llevar su estado con fecha de consulta.
9. **Capacidad de habitación:** con 3 adultos + 1 niño las opciones reales son cuarto cuádruple, triple + individual, o dos cuartos. Cotizar la combinación que existe, no la que suena bonita.
10. Nada de cifras redondas inventadas ni “aproximado” sin rango. Sin datos de relleno tipo “precio promedio mundial”.
11. Español correcto, sin anglicismos innecesarios; nombres propios de lugares y atracciones sí en su idioma original (Tokio, Seúl, Hanói, Bangkok y Singapur se escriben con tilde en español).

---

## 8. Comparación con las notas originales del equipo

Notas de partida, tal como se escribieron:

> En equipo / Planear un viaje a Japón / Presupuesto: turista, clase media, clase alta / 15 días / 2 equipos ganadores / pagina web? Presentación? Video? / se presenta / se tiene que vender / Fecha entrega: 22 octubre / Paquetes con actividades y/o más destinos ± una cantidad / Plan extra: asian tour

Qué faltaba y cómo se cerró:

| Nota original | Hueco detectado | Estado |
|---|---|---|
| “En equipo” | No decía cuántos | **Resuelto:** 3 integrantes → obliga a reparto de tiempos (§6) |
| “Planear un viaje a Japón” | Sin origen, sin temporada, sin viajeros; y “Japón” era más amplio que el producto | **Resuelto:** el destino es **Tokio**, salida GDL, 3 adultos + niño de 12, ventana de viaje elegida y justificada |
| “15 días” | Sin ventana de fechas | **Resuelto:** se elige por clima/temporada/precio |
| “turista / clase media / clase alta” | Sin montos | **Resuelto:** **$25,000** y $150,000 **por persona** |
| “Paquetes con actividades y/o más destinos ± una cantidad” | “± una cantidad” era ambiguo | **Resuelto:** el ± aplica al **precio del plan Asia** ($150,000 pp ± $15,000), no al número de actividades. Los tres niveles se diferencian por profundidad dentro de Tokio, no por estrellas de hotel |
| “pagina web? Presentación? Video?” | Era pregunta, no decisión | **Resuelto:** sitio web + presentación oral con el sitio en vivo |
| “se presenta / se tiene que vender” | Dos objetivos sin jerarquía | **Resuelto:** el sitio vende, la presentación defiende las cifras; ambos obligatorios |
| “2 equipos ganadores” | Criterio desconocido | **Descartado:** nota interna, no va en el entregable |
| “Fecha entrega: 22 octubre” | Sin hora ni canal | **Descartado del documento:** también es nota interna; el trámite se resuelve aparte |
| “Plan extra: asian tour” | Sin ciudades, sin días, sin precio | **Resuelto:** Tokio → Seúl → Bangkok → Hanói → Singapur (5 ciudades decididas), dentro de $135,000–$165,000 pp |

Huecos y correcciones que no estaban escritos en ninguna parte y sí importan:

- **Duración de la presentación** — nunca se dijo; quedó en **7–10 minutos**, que con tres oradores son 2:20–3:20 por cabeza. Es el dato que decide cuántas ideas caben: dos o tres por bloque, no cinco.
- **Escalas aéreas** — nunca se dijo si se aceptaban; resultó que sí, y es la palanca que hace viable el paquete barato.
- **Composición del grupo** — se escribió “2 adultos + 1 niño” y se corrigió a **3 adultos + 1 niño**: cambia el total familiar en un 33% y obliga a cotizar habitaciones para cuatro.
- **Presupuesto mínimo** — arrancó en $15,000 y se movió a **$25,000 por persona**: los productos se recalibran, no se estiran.
- **Alcance geográfico** — “Japón” se acotó a **Tokio**: cambia el transporte (pase regional en vez de nacional), el hospedaje (una sola base) y la estructura del itinerario (barrios + salidas de un día).
- **Ruta del plan Asia** — se reescribió dos veces; la definitiva son cinco ciudades con regreso *open jaw*, no ida y vuelta.
- **Nombres de los integrantes** — para créditos del sitio y para la portada: los pone el equipo, el agente deja el bloque preparado.
- **Quién construye qué** — reparto real de trabajo dentro del equipo, no solo de tiempos al hablar.

---

## 9. Lo único que no decide el agente

- **Créditos del sitio y portada:** los nombres de los tres integrantes y el nombre del equipo los pone el equipo. Deja el lugar preparado (un bloque de créditos real, no un placeholder tipo “Lorem”), y no inventes nombres ni iniciales.
- **Reparto interno del trabajo** —quién investiga, quién escribe, quién ensaya qué— lo define el equipo; este documento solo fija el reparto de voz en la presentación.

---

## 10. Criterios de aceptación

- [ ] El sitio está publicado en GitHub Pages y la URL abre en incógnito, en celular, y **desde `file://`**.
- [ ] El selector cambia las cuatro opciones en vivo y la opción activa queda en la URL.
- [ ] Los cuatro productos tienen itinerario día por día, qué incluye / no incluye, precio por adulto, precio del niño, total del grupo y costo por día.
- [ ] El itinerario es **Tokio con base fija** (barrios + salidas de un día), no un circuito por Japón.
- [ ] La suma de rubros cuadra con el total en los cuatro productos.
- [ ] Existe la sección de transparencia con tipo de cambio fechado y fuentes con URL.
- [ ] El grupo de 4 está tratado como 3 adultos + 1 niño de 12 en toda la aritmética, y las habitaciones cotizadas existen para cuatro personas.
- [ ] Cada tramo aéreo indica escalas y duración total.
- [ ] El plan Asia tiene las cinco ciudades en orden (Tokio → Seúl → Bangkok → Hanói → Singapur) con regreso desde la última.
- [ ] El plan Asia cierra entre $135,000 y $165,000 por persona adulto.
- [ ] La tabla “gana / pierde” del Asia está contra el paquete de clase alta.
- [ ] Cero secretos y cero CDNs críticos en el repo; cero archivos con prefijo `_` sin `.nojekyll`.
- [ ] Guion de tres bloques con marcas de tiempo, dentro de 7 a 10 minutos totales y de 2:20–3:20 por bloque.
- [ ] Dos ensayos cronometrados hechos; diferencia entre el bloque más largo y el más corto ≤30 s.
- [ ] PDF de respaldo del sitio completo y capturas de las cuatro opciones.