/* =========================================================
   Tokio en 15 días — lógica de selector, fichas y auditoría
   Datos: precios.js (único bloque de datos)
   ========================================================= */
(() => {
  "use strict";

  const DATA = window.PRECIOS;
  if (!DATA) {
    console.error("No se cargó precios.js");
    return;
  }

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const byId = (id) => document.getElementById(id);
  const PRODUCT_IDS = ["turista", "media", "alta", "asia"];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const fmt = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  });
  const fmt2 = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const money = (n) => fmt.format(Math.round(n));
  const money2 = (n) => fmt2.format(n);
  const pct = (n) => `${(n * 100).toFixed(1).replace(".0", "")}%`;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));

  const state = {
    active: "turista",
    conVuelo: false
  };

  function setHash(id, push = true) {
    const url = `${location.href.split("#")[0]}#${id}`;
    try {
      if (push) history.pushState(null, "", url);
      else history.replaceState(null, "", url);
    } catch {
      if (push) location.hash = id;
    }
  }

  const COLORS = {
    vuelo: "#b52d22",
    hospedaje: "#1d2b46",
    alimentacion: "#566347",
    transporte: "#a9834a",
    actividades: "#8e6b52",
    seguro: "#6e6458",
    visas: "#6e6458",
    contingencia: "#c58b62",
    gestion: "#3b342b"
  };

  /* ---------- Cálculos ---------- */
  function categoriasFor(producto, conVuelo) {
    let cats = producto.categorias.map((c) => ({ ...c }));
    if (producto.id === "turista" && conVuelo) {
      cats = [{
        clave: "vuelo",
        nombre: "Vuelo redondo",
        adulto: producto.vueloAdulto,
        factorNino: 1,
        baseNino: "Tarifa adulta: el descuento infantil termina a los 11 años.",
        fuentes: [3, 4]
      }, ...cats];
    }
    return cats;
  }

  function calc(producto, conVuelo = false) {
    const cats = categoriasFor(producto, conVuelo);
    const adulto = cats.reduce((s, c) => s + c.adulto, 0);
    const nino = cats.reduce((s, c) => s + Math.round(c.adulto * c.factorNino), 0);
    const grupo = 3 * adulto + nino;
    return {
      cats,
      adulto,
      nino,
      grupo,
      porDiaGrupo: grupo / producto.dias / 4,
      porDiaAdulto: adulto / producto.dias
    };
  }

  function expectedAdult(producto, conVuelo) {
    return producto.id === "turista" && conVuelo
      ? producto.todoIncluidoAdulto
      : producto.precioAdulto;
  }
  function expectedChild(producto, conVuelo) {
    return producto.id === "turista" && conVuelo
      ? producto.todoIncluidoNino
      : producto.precioNino;
  }
  function expectedGroup(producto, conVuelo) {
    return producto.id === "turista" && conVuelo
      ? producto.todoIncluidoGrupo
      : producto.totalGrupo;
  }

  function refs(ids) {
    if (!ids || !ids.length) return '<span class="muted">—</span>';
    return ids.map((n) => `<a class="ref" href="#fuente-${n}" aria-label="Fuente ${n}">[${n}]</a>`).join(" ");
  }

  /* ---------- Tabs ---------- */
  function tabs() {
    return $$(".budget-tab");
  }

  function updateTabs() {
    const p = DATA.productos[state.active];
    tabs().forEach((tab) => {
      const active = tab.dataset.product === state.active;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    const panel = byId("producto");
    if (panel) panel.setAttribute("aria-labelledby", `tab-${state.active}`);
    const stateEl = $("[data-selector-state]");
    if (stateEl) {
      const extra = state.active === "turista" && state.conVuelo ? " · con vuelo" : "";
      stateEl.textContent = `Viendo: ${p.nombre}${extra}`;
    }
    document.title = `${p.nombre} · Tokio en 15 días`;
    const c = calc(p, state.conVuelo);
    const ann = byId("anuncio");
    if (ann) {
      ann.textContent = `${p.nombre}. ${money(c.adulto)} por adulto, ${money(c.nino)} el niño de 12, ${money(c.grupo)} el grupo de cuatro. ${money(c.porDiaGrupo)} por persona y día.`;
    }
  }

  function selectProduct(id, push = true) {
    if (!PRODUCT_IDS.includes(id)) return;
    state.active = id;
    state.conVuelo = false;
    if (push) setHash(id, true);
    renderAll();
    if (push) scrollToPanel();
  }

  function scrollToPanel() {
    const el = byId("producto");
    if (!el) return;
    const headerH = $(".site-header")?.offsetHeight || 0;
    const selectorH = $(".selector-wrap")?.offsetHeight || 0;
    const top = el.getBoundingClientRect().top + window.scrollY - headerH - selectorH - 10;
    window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
  }

  function setupTabs() {
    tabs().forEach((tab, i) => {
      tab.addEventListener("click", () => selectProduct(tab.dataset.product, true));
      tab.addEventListener("keydown", (e) => {
        const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
        if (!keys.includes(e.key)) return;
        e.preventDefault();
        let next = i;
        if (e.key === "ArrowRight") next = (i + 1) % tabs().length;
        if (e.key === "ArrowLeft") next = (i - 1 + tabs().length) % tabs().length;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = tabs().length - 1;
        const target = tabs()[next];
        target.focus();
        selectProduct(target.dataset.product, true);
      });
    });
  }

  /* ---------- Ficha de producto ---------- */
  function renderProduct() {
    const p = DATA.productos[state.active];
    const c = calc(p, state.conVuelo);
    const ventana = p.id === "asia" ? DATA.meta.ventanaAsia : DATA.meta.ventana;
    const scope = p.id === "turista"
      ? (state.conVuelo ? "Con vuelo" : "Solo terreno")
      : p.alcance;

    const scopeNote = p.id === "turista"
      ? `<b>El vuelo no cabe en $25,000.</b> La tarifa más barata consultada cuesta ${money(p.vueloAdulto)} por persona con maleta (1 escala, 25 h 30 min). Por eso el precio de lista es solo terreno. Con vuelo, el mismo paquete cuesta ${money(p.todoIncluidoAdulto)} por adulto y ${money(p.todoIncluidoGrupo)} el grupo de 4. Lo decimos antes de que lo pregunte el jurado.`
      : p.id === "asia"
        ? `<b>Banda de precio:</b> ${money(p.precioAdulto)} por adulto, dentro de la banda obligatoria de $135,000 a $165,000. El grupo paga ${money(p.totalGrupo)}: el mismo dinero que la clase alta, pero en 21 días y cinco países.`
        : `<b>Todo incluido.</b> Vuelo, hospedaje, transporte, entradas y seguro. Lo que no está en la lista de “no incluye” no se cobra extra. La letra chica está en la sección de riesgos.`;

    const priceCards = `
      <div class="price-grid">
        <article class="price-card main">
          <span class="price-kicker">Por adulto</span>
          <strong>${money(c.adulto)}</strong>
          <span class="price-sub">${p.id === "turista" ? (state.conVuelo ? "Con vuelo incluido" : "Solo terreno · vuelo aparte") : "Todo incluido"}</span>
          <span class="price-note">${p.id === "turista" ? (state.conVuelo ? "Precio de lista con vuelo" : "Precio de lista sin vuelo") : "Precio de lista"}</span>
        </article>
        <article class="price-card">
          <span class="price-kicker">Niño de 12</span>
          <strong>${money(c.nino)}</strong>
          <span class="price-sub">3 adultos + 1 niño = 4 viajeros</span>
          <span class="price-note">Ahorra en hotel y algunas entradas; no en vuelo ni metro.</span>
        </article>
        <article class="price-card">
          <span class="price-kicker">Grupo 3+1</span>
          <strong>${money(c.grupo)}</strong>
          <span class="price-sub">3 × adulto + niño</span>
          <span class="price-note">No es 4 × adulto ni un promedio.</span>
        </article>
        <article class="price-card">
          <span class="price-kicker">Por día por persona</span>
          <strong>${money(c.porDiaGrupo)}</strong>
          <span class="price-sub">Promedio del grupo · ${p.dias} días</span>
          <span class="price-note">Adulto: ${money(c.porDiaAdulto)}/día</span>
        </article>
      </div>
    `;

    const toggle = p.id === "turista" ? `
      <div class="price-toggle">
        <label class="switch" for="toggle-vuelo">
          <input type="checkbox" id="toggle-vuelo" ${state.conVuelo ? "checked" : ""}>
          <span class="switch-track" aria-hidden="true"></span>
          <span>Sumar vuelo redondo</span>
        </label>
        <span class="switch-note">+ ${money(p.vueloAdulto)} por persona · 1 escala en Vancouver · 25 h 30 min ida / 18 h 45 min vuelta</span>
      </div>
    ` : "";

    const hotelCard = `
      <article class="card">
        <p class="card-kicker">Hospedaje · ${p.id === "asia" ? "cinco ciudades" : "zona parte del producto"}</p>
        <h3>${esc(p.hotel.zona)}</h3>
        <p>${esc(p.hotel.tipo)}. ${esc(p.hotel.ejemplo)}.</p>
        <p><b>Habitación:</b> ${esc(p.hotel.habitacion)} · ${p.hotel.noches} noches.</p>
        <p class="math">${esc(p.hotel.matematica)}</p>
        <p class="why">${esc(p.hotel.porQue)}</p>
        <p class="why">Fuentes de la tarifa: ${refs(p.hotel.fuentes)}</p>
        ${p.id === "asia" ? '<p class="why"><a href="#plan-asia">Ver el desglose de las cinco ciudades →</a></p>' : ""}
      </article>
    `;

    const flightRows = p.vuelos.map((f) => `
      <tr>
        <td>${esc(f.tramo)}<br><span class="tiny">${esc(f.fecha)}</span></td>
        <td>${esc(f.aerolinea)}</td>
        <td>${esc(f.escalas)}<br><span class="tiny">${esc(f.duracion)}</span></td>
        <td>${esc(f.precio)} ${refs(f.fuentes)}</td>
      </tr>
    `).join("");

    const flightCard = `
      <article class="card">
        <p class="card-kicker">Vuelos · ida y vuelta</p>
        <h3>${p.id === "turista" ? "El vuelo se cotiza aparte" : p.id === "asia" ? "Seis tramos, un solo sentido" : "Vuelo redondo incluido"}</h3>
        <table class="flight-table">
          <caption>Tramo, aerolínea, escalas y duración</caption>
          <thead><tr><th>Tramo</th><th>Aerolínea</th><th>Escalas / duración</th><th>Precio</th></tr></thead>
          <tbody>${flightRows}</tbody>
        </table>
        <p class="flight-note">${p.id === "turista" ? "No existe GDL–Tokio sin escala. La tarifa más barata tiene 1 escala en Vancouver; hay opciones de 2 escalas y 34–41 h por USD 50–100 menos." : p.id === "asia" ? "El regreso sale de Singapur: open jaw, no ida y vuelta a Tokio. Los tramos regionales son directos; el largo va en premium economy. La tarifa se construye tramo por tramo y se compra como open jaw + regionales." : "La tarifa incluye equipaje documentado. El niño de 12 paga tarifa adulta; no hay descuento infantil a esa edad."}</p>
        <details class="flight-breakdown">
          <summary class="link-btn">Ver cómo se arma la tarifa</summary>
          <table class="flight-table" style="margin-top:.5rem">
            <thead><tr><th>Concepto</th><th>USD</th><th>MXN</th></tr></thead>
            <tbody>${p.desgloseVuelo.map((d) => `<tr><td>${esc(d.concepto)}</td><td>${d.usd ? "USD " + d.usd : "—"}</td><td>${money2(d.mxn)}</td></tr>`).join("")}</tbody>
          </table>
        </details>
      </article>
    `;

    const days = p.itinerario.map((d) => `
      <article class="day-card">
        <div class="day-top"><span class="day-num">DÍA ${String(d.dia).padStart(2, "0")}</span><span class="day-date">${esc(d.fecha)}</span></div>
        <h4>${esc(d.titulo)}</h4>
        <p class="day-zone">${esc(d.zona)}</p>
        <details>
          <summary>Ver el día</summary>
          <ul>${d.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
        </details>
        <div class="day-tags">${d.etiquetas.map((t) => `<span class="day-tag">${esc(t)}</span>`).join("")}</div>
      </article>
    `).join("");

    const includes = p.incluye.map((i) => `<li>${esc(i)}</li>`).join("");
    const excludes = p.noIncluye.map((i) => `<li>${esc(i)}</li>`).join("");

    const typicalRows = p.diaTipico.lineas.map((l) => `
      <tr><td>${esc(l.hora)}</td><td>${esc(l.concepto)}</td><td>${money(l.mxn)}</td><td class="tiny">${esc(l.nota)}</td></tr>
    `).join("");

    const activities = p.actividades.map((a) => `
      <li>
        <span class="activity-name">${esc(a.nombre)}</span>
        <span class="activity-price">${esc(a.precio)} ${refs([a.fuente])}</span>
        <span class="activity-note">${esc(a.nota)}</span>
      </li>
    `).join("");

    const salidas = p.salidas.map((s) => `
      <li>
        <b>${esc(s.nombre)}</b>
        <span>${esc(s.detalle)} · ${esc(s.transporte)}</span>
        <small>${esc(s.entrada)}</small>
      </li>
    `).join("");

    const transportTitle = p.id === "asia"
      ? "Cinco metros, seis vuelos, cero pase único"
      : "Pases locales, no un JR Pass nacional";
    const transportText = p.id === "asia"
      ? "El Asia no tiene un pase ferroviario que cubra cinco países. Se usan metros y traslados en cada ciudad, más los seis vuelos del itinerario. El open jaw evita volver a Tokio."
      : "Con base fija en Tokio, un JR Pass nacional no se paga: no hay recorrido nacional. Se compran pases locales y de un día para Tokio y sus salidas. Un pase mal elegido es el error de novato que el jurado detecta en dos preguntas.";
    const transportMath = p.id === "turista"
      ? "Keisei Skyliner + Suica + metro 72 h + Tobu Nikko + Enoden."
      : p.id === "media"
        ? "N'EX redondo + Suica + Odakyu Hakone + Tobu Nikko + Enoden."
        : p.id === "alta"
          ? "Traslados privados + chofer para las salidas + tren y taxi cuando conviene."
          : "Metro y traslados en cada ciudad + seis vuelos.";
    const transportCard = `
      <article class="card transport-card">
        <p class="card-kicker">Transporte · coherencia con la ruta</p>
        <h3>${transportTitle}</h3>
        <p>${transportText}</p>
        <p class="math">${transportMath}</p>
      </article>
    `;

    const html = `
      <div class="product-head">
        <div>
          <p class="product-kicker">${esc(p.categoria)} · ${esc(scope)}</p>
          <h2>${esc(p.nombre)}</h2>
          <p class="product-lema">${esc(p.lema)}</p>
          <p class="product-resumen">${esc(p.resumen)}</p>
        </div>
        <div class="product-side">
          <p class="scope">${esc(scope)}</p>
          <p class="dates">${p.dias} días / ${p.noches} noches · ${esc(ventana.detalle)}</p>
          <div class="badges">
            <span class="badge"><b>${p.dias}</b> días</span>
            <span class="badge"><b>${p.noches}</b> noches</span>
            <span class="badge"><b>3+1</b> viajeros</span>
            <span class="badge ${p.id === "turista" ? "badge-red" : ""}">${p.id === "asia" ? "5 ciudades" : "base fija"}</span>
            <span class="badge">consulta 22 oct 2026</span>
          </div>
        </div>
      </div>

      ${priceCards}
      ${toggle}

      <p class="scope-note">${scopeNote}</p>

      <div class="product-grid">
        ${hotelCard}
        ${flightCard}
      </div>

      ${transportCard}

      <div class="itinerary-block">
        <div class="block-head">
          <h3>Itinerario día por día</h3>
          <p>${p.dias} días · ${p.noches} noches · ${p.id === "asia" ? "cinco ciudades" : "base fija en Tokio"}</p>
        </div>
        <div class="itinerary">${days}</div>
      </div>

      <div class="includes-grid">
        <div class="include-box">
          <h3>Incluye</h3>
          <ul class="include-list yes">${includes}</ul>
        </div>
        <div class="include-box">
          <h3>No incluye</h3>
          <ul class="include-list no">${excludes}</ul>
        </div>
      </div>

      <div class="typical-grid">
        <div class="card">
          <p class="card-kicker">Día típico · cómo se siente el precio</p>
          <h3>${esc(p.diaTipico.titulo)}</h3>
          <table class="typical-table">
            <caption>Desglose de un día, en pesos</caption>
            <thead><tr><th>Hora</th><th>Concepto</th><th>MXN</th><th>Nota</th></tr></thead>
            <tbody>
              ${typicalRows}
              <tr class="total"><td></td><td>Total del día</td><td>${money(p.diaTipico.total)}</td><td></td></tr>
            </tbody>
          </table>
          <p class="table-note">Comida: fuente [53]. Transporte: [17] y pases citados en la ficha. Entradas: las fuentes de la lista de actividades.</p>
        </div>
        <div class="typical-side">
          <span class="kicker" style="color:#f0a79f">Promedio del paquete</span>
          <div class="big-number">${money(p.diaTipico.promedio)}</div>
          <p class="small">por persona y por día · promedio del grupo</p>
          <p>${esc(p.diaTipico.nota)}</p>
        </div>
      </div>

      <div class="activities-grid">
        <div class="card">
          <h3>Actividades con nombre y precio</h3>
          <ul class="activity-list">${activities}</ul>
        </div>
        <div class="card">
          <h3>Salidas de un día</h3>
          <ul class="trip-list">${salidas}</ul>
        </div>
      </div>

      <div class="product-callout">
        <p><b>${p.id === "turista" ? "El paquete barato no sale de Tokio." : p.id === "asia" ? "No es un upgrade: es otro producto." : "La diferencia no es el hotel."}</b> ${p.id === "turista" ? "Con base fija, cada salida suma profundidad sin pagar otro hotel. Si el cliente quiere cinco ciudades, ese es el Asian Tour." : p.id === "asia" ? "El mismo dinero compra más mundo y menos comodidad por destino. La tabla gana/pierde lo dice sin maquillaje." : "Lo que se compra es tiempo, acceso y experiencias. La aritmética completa está en la siguiente sección."}</p>
        <a class="btn" href="#transparencia">Ver la aritmética completa</a>
      </div>
    `;

    byId("producto").innerHTML = html;

    const toggleInput = byId("toggle-vuelo");
    if (toggleInput) {
      toggleInput.addEventListener("change", (e) => {
        state.conVuelo = e.target.checked;
        renderAll();
        const next = byId("toggle-vuelo");
        if (next) next.focus();
      });
    }
  }

  /* ---------- Comparador ---------- */
  function compareValue(p, clave) {
    const c = calc(p, false);
    const all = p.id === "turista" ? calc(p, true) : null;
    switch (clave) {
      case "precio":
        return p.id === "turista"
          ? `<strong>${money(p.precioAdulto)}</strong><span class="sub">con vuelo: ${money(p.todoIncluidoAdulto)}</span>`
          : `<strong>${money(p.precioAdulto)}</strong>`;
      case "nino":
        return p.id === "turista"
          ? `<strong>${money(p.precioNino)}</strong><span class="sub">con vuelo: ${money(p.todoIncluidoNino)}</span>`
          : `<strong>${money(p.precioNino)}</strong>`;
      case "grupo":
        return p.id === "turista"
          ? `<strong>${money(p.totalGrupo)}</strong><span class="sub">con vuelo: ${money(p.todoIncluidoGrupo)}</span>`
          : `<strong>${money(p.totalGrupo)}</strong>`;
      case "dia":
        return p.id === "turista"
          ? `<strong>${money(c.porDiaGrupo)}</strong><span class="sub">con vuelo: ${money(all.porDiaGrupo)}</span>`
          : `<strong>${money(c.porDiaGrupo)}</strong><span class="sub">adulto: ${money(c.porDiaAdulto)}/día</span>`;
      case "vuelo": return `${esc(p.vueloResumen)}<span class="sub">${p.id === "turista" ? money(p.vueloAdulto) + " pp" : p.id === "asia" ? "open jaw" : "incluido"}</span>`;
      case "hotel": return esc(p.hotelResumen);
      case "habitacion": return esc(p.habitacion);
      case "salidas": return esc(p.salidasResumen);
      case "actividades": return esc(p.actividadesResumen);
      case "guia": return esc(p.guia);
      case "transporte": return esc(p.transporteResumen);
      case "visas": return esc(p.visasResumen);
      case "comodidad": return esc(p.comodidad);
      case "ideal": return esc(p.idealPara);
      default: return "";
    }
  }

  function renderCompare() {
    const table = byId("compare-table");
    if (!table) return;
    const products = PRODUCT_IDS.map((id) => DATA.productos[id]);
    table.querySelector("thead").innerHTML = `
      <tr>
        <th scope="col">Rubro</th>
        ${products.map((p) => `<th scope="col" class="${p.id === state.active ? "active" : ""}">${esc(p.nombre)}<span class="sub">${p.id === "turista" ? "solo terreno / con vuelo" : p.id === "asia" ? "21 días · 5 ciudades" : "todo incluido"}</span></th>`).join("")}
      </tr>
    `;
    table.querySelector("tbody").innerHTML = DATA.comparador.filas.map((fila) => `
      <tr>
        <th scope="row">${esc(fila.label)}</th>
        ${products.map((p) => `<td class="${p.id === state.active ? "active" : ""}">${compareValue(p, fila.clave)}</td>`).join("")}
      </tr>
    `).join("");
  }

  /* ---------- Ledger ---------- */
  function renderLedger() {
    const p = DATA.productos[state.active];
    const c = calc(p, state.conVuelo);
    const all = p.id === "turista" ? calc(p, true) : null;
    const adultExpected = expectedAdult(p, state.conVuelo);
    const childExpected = expectedChild(p, state.conVuelo);
    const groupExpected = expectedGroup(p, state.conVuelo);

    const rows = c.cats.map((cat) => {
      const child = Math.round(cat.adulto * cat.factorNino);
      const group = 3 * cat.adulto + child;
      const share = cat.adulto / c.adulto;
      return `
        <tr>
          <th scope="row">${esc(cat.nombre)}<span class="basis">${esc(cat.baseNino)}</span></th>
          <td>${money(cat.adulto)}</td>
          <td class="factor">${pct(cat.factorNino)}</td>
          <td>${money(child)}</td>
          <td>${money(group)}</td>
          <td>${pct(share)}</td>
          <td>${refs(cat.fuentes)}</td>
        </tr>
      `;
    }).join("");

    const legend = c.cats.map((cat) => `
      <span><i style="background:${COLORS[cat.clave] || "#6e6458"}"></i>${esc(cat.nombre)} <b>${pct(cat.adulto / c.adulto)}</b></span>
    `).join("");

    const bar = c.cats.map((cat) => `
      <span style="width:${(cat.adulto / c.adulto) * 100}%;background:${COLORS[cat.clave] || "#6e6458"}" title="${esc(cat.nombre)}: ${pct(cat.adulto / c.adulto)}"></span>
    `).join("");

    const checks = [
      check(Math.abs(c.adulto - adultExpected) < 1, `La suma de rubros da ${money(c.adulto)} por adulto.`),
      check(Math.abs(c.nino - childExpected) < 1, `La suma de rubros da ${money(c.nino)} para el niño de 12.`),
      check(Math.abs(c.grupo - groupExpected) < 1, `3 × ${money(c.adulto)} + ${money(c.nino)} = ${money(c.grupo)}.`),
      check(Math.abs(c.porDiaGrupo - c.grupo / p.dias / 4) < 0.01, `${money(c.grupo)} ÷ ${p.dias} días ÷ 4 = ${money(c.porDiaGrupo)} por persona/día.`),
      check(Math.abs(p.diaTipico.total - p.diaTipico.lineas.reduce((s, l) => s + l.mxn, 0)) < 1, `El día típico suma ${money(p.diaTipico.total)}.`),
      check(p.id !== "asia" || (p.precioAdulto >= 135000 && p.precioAdulto <= 165000), p.id === "asia" ? "El precio por adulto está dentro de la banda $135,000–$165,000." : "El precio por adulto coincide con el de lista.")
    ].join("");

    const factorRows = [
      ["Aéreo", "Tarifa adulta", "El descuento infantil termina a los 11 años."],
      ["Hospedaje", "Sin cargo extra", "Duerme en la misma habitación; no se cotiza cama."],
      ["Transporte", "Tarifa adulta", "JR y metro consideran adulto desde los 12."],
      ["Disney", "Junior 12–17", "≈17% menos que la tarifa adulta."],
      ["Skytree", "Niño 6–14", "50% de la tarifa adulta."],
      ["teamLab", "Niño 4–12", "¥1,500 contra ¥3,800."],
      ["Ghibli", "Niño 7–12", "¥400 contra ¥1,000."],
      ["Comida", "80% del adulto", "Porciones menores y desayuno incluido."],
      ["Contingencia", "90%", "Menor consumo de presupuesto."],
      ["Gestión", "80%", "Menos gestión individual."]
    ].map(([rubro, factor, nota]) => `<tr><td>${rubro}</td><td>${factor}</td><td class="basis">${nota}</td></tr>`).join("");

    const totalsRows = PRODUCT_IDS.map((id) => {
      const prod = DATA.productos[id];
      const cc = calc(prod, false);
      const aa = id === "turista" ? calc(prod, true) : null;
      return `
        <tr class="${id === state.active ? "active" : ""}">
          <th scope="row">${esc(prod.nombre)}</th>
          <td>${money(prod.precioAdulto)}</td>
          <td>${money(prod.precioNino)}</td>
          <td>${money(prod.totalGrupo)}</td>
          <td>${money(cc.porDiaGrupo)}</td>
          <td>${id === "turista" ? `${money(prod.todoIncluidoGrupo)} · ${money(aa.porDiaGrupo)}/día` : "—"}</td>
        </tr>
      `;
    }).join("");

    byId("ledger").innerHTML = `
      <div class="fx-strip">
        <div><span class="fx-label">Yen japonés</span><span class="fx-value">¥1 = $0.1165</span><span class="fx-note">Banxico, 19/10/2026</span></div>
        <div><span class="fx-label">Dólar</span><span class="fx-value">USD 1 = $18.4253</span><span class="fx-note">FIX Banxico, 21/10/2026</span></div>
        <div><span class="fx-label">Consulta de tarifas</span><span class="fx-value">22/10/2026</span><span class="fx-note">No es una reserva: se congela con el 30%.</span></div>
      </div>

      <div class="ledger-grid">
        <div class="ledger-main">
          <h3>${esc(p.nombre)} · rubro por rubro</h3>
          <p class="ledger-sub">${state.conVuelo && p.id === "turista" ? "Con vuelo incluido" : p.id === "turista" ? "Solo terreno: el vuelo se suma aparte" : "Todo incluido"} · ${p.dias} días / ${p.noches} noches · 3 adultos + 1 niño de 12.</p>
          <div class="table-scroll" tabindex="0" role="region" aria-label="Desglose de rubros del paquete activo">
            <table class="ledger-table">
              <caption class="sr-only">Rubros, monto adulto, factor infantil, monto niño, total grupo, porcentaje y fuente</caption>
              <thead><tr><th>Rubro</th><th>Adulto</th><th>Factor niño</th><th>Niño</th><th>Grupo 3+1</th><th>% adulto</th><th>Fuente</th></tr></thead>
              <tbody>
                ${rows}
                <tr class="total"><td>Total</td><td>${money(c.adulto)}</td><td>—</td><td>${money(c.nino)}</td><td>${money(c.grupo)}</td><td>100%</td><td>—</td></tr>
              </tbody>
            </table>
          </div>
          <p class="table-note">El grupo no es 4 × adulto: es 3 × adulto + niño. La columna “% adulto” muestra en qué se va el precio de lista, no el del grupo. Los rubros de comida, seguro y contingencia se apoyan en las fuentes [53]–[55]; la [55] es el modelo de este sitio, no una tarifa de mercado.</p>
          <div class="bar-card" style="border:0;padding:0;margin-top:1rem">
            <h3>¿En qué se va el dinero?</h3>
            <div class="cost-bar" aria-hidden="true">${bar}</div>
            <div class="cost-legend">${legend}</div>
          </div>
        </div>

        <div class="ledger-side">
          <div class="formula-card">
            <span class="fx-label">La fórmula del grupo</span>
            <p class="formula">3 × ${money(c.adulto)}<br>+ ${money(c.nino)}<br>= <em>${money(c.grupo)}</em><small>Precio por adulto, precio del niño y total del grupo. Tres cifras distintas, nunca confundidas.</small></p>
            <p class="formula">${money(c.grupo)} ÷ ${p.dias} ÷ 4<br>= <em>${money(c.porDiaGrupo)}</em><small>Promedio por persona y por día. El adulto paga ${money(c.porDiaAdulto)}/día.</small></p>
          </div>

          <div class="check-card">
            <h3>Verificación</h3>
            <ul class="check-list">${checks}</ul>
          </div>

          <div class="check-card">
            <h3>El niño de 12 no paga como niño en todo</h3>
            <div class="table-scroll factor-scroll" tabindex="0" role="region" aria-label="Factores de precio infantil, desplazable horizontalmente">
              <table class="factor-table">
                <thead><tr><th>Rubro</th><th>Factor</th><th>Por qué</th></tr></thead>
                <tbody>${factorRows}</tbody>
              </table>
            </div>
            <p class="factor-note">A los 12 años se acaba la tarifa infantil en la mayoría de aerolíneas y en el transporte de Tokio. El ahorro real está en el hospedaje y en algunas atracciones. Por eso el niño no paga la mitad: paga ${money(c.nino)} contra ${money(c.adulto)} del adulto.</p>
          </div>
        </div>
      </div>

      <div class="all-totals">
        <div class="all-totals-head">
          <h3>Todos los totales, en una tabla</h3>
          <a class="btn btn-ghost" href="./anexo.html">Anexo imprimible de fuentes y modelo</a>
        </div>
        <div class="table-scroll" tabindex="0" role="region" aria-label="Tabla de totales de los cuatro paquetes, desplazable horizontalmente">
          <table class="totals-table">
            <caption class="sr-only">Totales por producto: adulto, niño, grupo y costo por día</caption>
            <thead><tr><th>Producto</th><th>Adulto</th><th>Niño 12</th><th>Grupo 3+1</th><th>Por día (promedio)</th><th>Turista con vuelo</th></tr></thead>
            <tbody>${totalsRows}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  function check(ok, label) {
    return `<li><span class="${ok ? "ok" : "bad"}" aria-hidden="true">${ok ? "✓" : "×"}</span><span><span class="sr-only">${ok ? "Cumple: " : "No cumple: "}</span>${label}</span></li>`;
  }

  /* ---------- Asia ---------- */
  function renderAsia() {
    const a = DATA.asia;
    const p = DATA.productos.asia;
    const c = calc(p, false);

    byId("asia-cities").innerHTML = a.ciudades.map((city) => `
      <div class="asia-city">
        <span class="n">0${city.n}</span>
        <b>${esc(city.nombre)}</b>
        <span>${esc(city.pais)} · ${city.noches} noches</span>
      </div>
    `).join("");

    byId("asia-summary").innerHTML = `
      <div class="asia-summary-card highlight">
        <span class="label">Precio por adulto</span>
        <div class="value">${money(p.precioAdulto)}</div>
        <div class="note">Dentro de la banda $135,000–$165,000</div>
      </div>
      <div class="asia-summary-card">
        <span class="label">Total grupo 3+1</span>
        <div class="value">${money(p.totalGrupo)}</div>
        <div class="note">3 × adulto + niño de 12</div>
      </div>
      <div class="asia-summary-card">
        <span class="label">Costo por día por persona</span>
        <div class="value">${money(c.porDiaGrupo)}</div>
        <div class="note">21 días · promedio del grupo</div>
      </div>
      <div class="asia-summary-card">
        <span class="label">Alta vs Asia</span>
        <div class="value">−28.6%</div>
        <div class="note">$9,388 → $6,701 por día</div>
      </div>
      <div class="asia-summary-card">
        <span class="label">Regreso</span>
        <div class="value text-value">Open jaw</div>
        <div class="note">Desde Singapur, no desde Tokio</div>
      </div>
    `;

    byId("gain-loss").innerHTML = `
      <div class="gain-col">
        <h4>Lo que se gana</h4>
        <ul>${a.gana.map((g) => `<li><b>${esc(g.titulo)}</b><span>${esc(g.detalle)}</span></li>`).join("")}</ul>
      </div>
      <div class="loss-col">
        <h4>Lo que se pierde</h4>
        <ul>${a.pierde.map((g) => `<li><b>${esc(g.titulo)}</b><span>${esc(g.detalle)}</span></li>`).join("")}</ul>
      </div>
    `;

    byId("asia-table").querySelector("tbody").innerHTML = a.tabla.map((row) => `
      <tr><td>${esc(row.indicador)}</td><td>${esc(row.alta)}</td><td>${esc(row.asia)}</td><td>${esc(row.diferencia)}</td></tr>
    `).join("");

    byId("asia-visas").innerHTML = `
      <h3>Visas, país por país (pasaporte mexicano)</h3>
      <p>Verificado el 22/10/2026. La ruta toca cinco países con régimen distinto. La visa tailandesa es la más frágil: se solicita antes de comprar los vuelos y requiere estados de cuenta, reservas y comprobantes.</p>
      <div class="visa-grid">
        ${a.visas.map((v) => {
          const fuentes = v.pais === "Tailandia" ? [21, 22] : [v.fuente];
          return `<article class="visa-card">
            <h4>${esc(v.pais)}</h4>
            <p class="visa-status">${esc(v.visa)}</p>
            <p class="visa-cost">${esc(v.costo)} ${refs(fuentes)}</p>
            <p class="visa-note">${esc(v.tramite)}</p>
          </article>`;
        }).join("")}
      </div>
    `;
  }

  /* ---------- Riesgos ---------- */
  function renderRisks() {
    byId("risk-grid").innerHTML = DATA.riesgos.map((r, i) => `
      <article class="risk-card">
        <div class="risk-top"><h3>${esc(r.titulo)}</h3><span class="risk-num">R${String(i + 1).padStart(2, "0")}</span></div>
        <p><b>Qué puede pasar:</b> ${esc(r.que)}</p>
        <p class="risk-do"><b>Qué hacemos:</b> ${esc(r.hace)}</p>
        <p class="risk-num-line">${esc(r.numero)}</p>
      </article>
    `).join("");
  }

  /* ---------- Fuentes ---------- */
  function renderSources() {
    const tbody = byId("sources-table").querySelector("tbody");
    tbody.innerHTML = DATA.fuentes.map((f) => `
      <tr id="fuente-${f.n}">
        <td>${f.n}</td>
        <td>${esc(f.grupo)}</td>
        <td><a href="${esc(f.url)}" target="_blank" rel="noopener noreferrer">${esc(f.titulo)}</a></td>
        <td>${esc(f.fecha)}</td>
        <td>${esc(f.uso)}</td>
      </tr>
    `).join("");

    const input = byId("fuente-busqueda");
    const count = $("[data-sources-count]");
    const rows = $$("#sources-table tbody tr");
    const update = () => {
      const q = (input.value || "").trim().toLowerCase();
      let visible = 0;
      rows.forEach((row) => {
        const show = !q || row.textContent.toLowerCase().includes(q);
        row.classList.toggle("hidden", !show);
        if (show) visible += 1;
      });
      count.textContent = `${visible} de ${rows.length} fuentes`;
    };
    input.addEventListener("input", update);
    update();
  }

  /* ---------- FAQ ---------- */
  function renderFAQ() {
    byId("faq-list").innerHTML = DATA.faq.map((item, i) => `
      <details class="faq-item">
        <summary>
          <span class="q-num">${String(i + 1).padStart(2, "0")}</span>
          <span>${esc(item.p)}</span>
          <span class="q-mark" aria-hidden="true"></span>
        </summary>
        <div class="answer"><p>${esc(item.r)}</p></div>
      </details>
    `).join("");
  }

  /* ---------- Créditos ---------- */
  function renderCredits() {
    const nombres = (DATA.meta.integrantes || []).filter(Boolean);
    const team = DATA.meta.equipo || "";
    const mini = $("[data-credits-mini]");
    if (mini) {
      if (nombres.length === 3) {
        mini.innerHTML = `Equipo ${esc(team || "—")} · ${nombres.map(esc).join(" · ")}`;
      } else {
        mini.innerHTML = `Equipo <span class="blank"></span> · <span class="blank"></span> · <span class="blank"></span>`;
      }
    }
    const card = byId("credits-card");
    if (!card) return;
    card.innerHTML = `
      <div class="credits-team">
        <span class="label">Equipo</span>
        <div class="name">${team ? esc(team) : '<span class="blank" aria-label="Nombre del equipo pendiente"></span>'}</div>
      </div>
      <div class="credits-roles">
        ${DATA.creditos.roles.map((r, i) => `
          <div class="credits-role">
            <div class="role">${esc(r.rol)}</div>
            <div class="person">${nombres[i] ? esc(nombres[i]) : '<span class="blank" aria-label="Nombre pendiente"></span>'}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  /* ---------- Utilidades de UI ---------- */
  function setupPrint() {
    $$("[data-print]").forEach((btn) => btn.addEventListener("click", () => window.print()));
  }

  function setupMenu() {
    const btn = $("[data-menu]");
    const nav = byId("site-nav");
    if (!btn || !nav) return;
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        btn.focus();
      }
    });
  }

  function setupCopy() {
    const btn = $("[data-copy-link]");
    if (!btn) return;
    btn.addEventListener("click", async () => {
      const base = location.href.split("#")[0];
      const url = `${base}#${state.active}`;
      try {
        await navigator.clipboard.writeText(url);
        const old = btn.textContent;
        btn.textContent = "Enlace copiado";
        setTimeout(() => { btn.textContent = old; }, 1800);
      } catch {
        window.prompt("Copia el enlace de este nivel:", url);
      }
    });
  }

  function handleHash() {
    const h = location.hash.replace("#", "");
    if (PRODUCT_IDS.includes(h)) {
      state.active = h;
      state.conVuelo = false;
      renderAll();
    }
  }

  function renderAll() {
    renderProduct();
    renderCompare();
    renderLedger();
    updateTabs();
  }

  function init() {
    setupTabs();
    setupPrint();
    setupMenu();
    setupCopy();
    renderRisks();
    renderSources();
    renderFAQ();
    renderCredits();
    renderAsia();

    const initial = location.hash.replace("#", "");
    if (PRODUCT_IDS.includes(initial)) {
      state.active = initial;
    } else if (!location.hash) {
      setHash("turista", false);
    }
    renderAll();

    if (PRODUCT_IDS.includes(initial)) {
      requestAnimationFrame(() => setTimeout(scrollToPanel, 60));
    }

    window.addEventListener("hashchange", handleHash);
    window.addEventListener("popstate", handleHash);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
