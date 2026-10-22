/* Anexo imprimible · lee precios.js y dibuja el modelo completo */
(() => {
  "use strict";
  const DATA = window.PRECIOS;
  if (!DATA) return;

  const fmt = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
  const money = (n) => fmt.format(Math.round(n));
  const pct = (n) => `${(n * 100).toFixed(1).replace(".0", "")}%`;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const refs = (ids) => (ids && ids.length ? ids.map((n) => `<a class="ref" href="#fuente-${n}">[${n}]</a>`).join(" ") : "—");

  function cats(p, conVuelo = false) {
    let list = p.categorias.map((c) => ({ ...c }));
    if (p.id === "turista" && conVuelo) {
      list = [{
        clave: "vuelo", nombre: "Vuelo redondo", adulto: p.vueloAdulto, factorNino: 1,
        baseNino: "Tarifa adulta a los 12 años.", fuentes: [3, 4]
      }, ...list];
    }
    return list;
  }
  function calc(p, conVuelo = false) {
    const list = cats(p, conVuelo);
    const adulto = list.reduce((s, c) => s + c.adulto, 0);
    const nino = list.reduce((s, c) => s + Math.round(c.adulto * c.factorNino), 0);
    return { list, adulto, nino, grupo: 3 * adulto + nino, porDia: (3 * adulto + nino) / p.dias / 4 };
  }

  const IDS = ["turista", "media", "alta", "asia"];
  const PRODUCTS = IDS.map((id) => DATA.productos[id]);

  function renderCover() {
    const box = document.getElementById("anexo-cover-grid");
    if (!box) return;
    box.innerHTML = PRODUCTS.map((p) => {
      const c = calc(p, false);
      return `<div class="anexo-cover-price">
        <span>${esc(p.nombre)}</span>
        <b>${money(c.adulto)}</b>
        <small>${p.id === "turista" ? "por adulto · solo terreno" : "por adulto · todo incluido"}</small>
        ${p.id === "turista" ? `<small>con vuelo: ${money(p.todoIncluidoAdulto)}</small>` : `<small>${p.dias} días / ${p.noches} noches</small>`}
      </div>`;
    }).join("");
  }

  function renderTotals() {
    const tbody = document.querySelector("#anexo-totales tbody");
    tbody.innerHTML = PRODUCTS.map((p) => {
      const c = calc(p, false);
      return `<tr>
        <th scope="row">${esc(p.nombre)}</th>
        <td>${p.dias}</td>
        <td>${money(p.precioAdulto)}</td>
        <td>${money(p.precioNino)}</td>
        <td>${money(p.totalGrupo)}</td>
        <td>${money(c.porDia)}</td>
        <td>${p.id === "turista" ? "Solo terreno / con vuelo" : "Todo incluido"}</td>
      </tr>`;
    }).join("");
  }

  function renderProduct(p) {
    const c = calc(p, false);
    const all = p.id === "turista" ? calc(p, true) : null;
    const rows = c.list.map((cat) => {
      const child = Math.round(cat.adulto * cat.factorNino);
      return `<tr>
        <th scope="row">${esc(cat.nombre)}<span class="basis">${esc(cat.baseNino)}</span></th>
        <td>${money(cat.adulto)}</td>
        <td>${pct(cat.factorNino)}</td>
        <td>${money(child)}</td>
        <td>${money(3 * cat.adulto + child)}</td>
        <td>${pct(cat.adulto / c.adulto)}</td>
        <td>${refs(cat.fuentes)}</td>
      </tr>`;
    }).join("");

    const extra = p.id === "turista" ? `
      <tr class="subtotal"><th scope="row">Subtotal terreno</th><td>${money(c.adulto)}</td><td>—</td><td>${money(c.nino)}</td><td>${money(c.grupo)}</td><td>100%</td><td>—</td></tr>
      <tr><th scope="row">Vuelo redondo (aparte)<span class="basis">Tarifa base + maleta; se congela al emitir.</span></th><td>${money(p.vueloAdulto)}</td><td>100%</td><td>${money(p.vueloNino)}</td><td>${money(3 * p.vueloAdulto + p.vueloNino)}</td><td>—</td><td>${refs([3, 4])}</td></tr>
      <tr class="total"><th scope="row">Total con vuelo</th><td>${money(all.adulto)}</td><td>—</td><td>${money(all.nino)}</td><td>${money(all.grupo)}</td><td>—</td><td>—</td></tr>
    ` : `<tr class="total"><th scope="row">Total</th><td>${money(c.adulto)}</td><td>—</td><td>${money(c.nino)}</td><td>${money(c.grupo)}</td><td>100%</td><td>—</td></tr>`;

    const itinerary = p.itinerario.map((d) => `
      <tr><td>D${String(d.dia).padStart(2, "0")}</td><td>${esc(d.fecha)}</td><td>${esc(d.titulo)}</td><td>${esc(d.zona)}</td></tr>
    `).join("");

    const hotel = `
      <div class="anexo-box">
        <h3>Hospedaje</h3>
        <p><b>${esc(p.hotel.zona)}</b> · ${esc(p.hotel.tipo)} · ${p.hotel.noches} noches.</p>
        <p>${esc(p.hotel.habitacion)}. ${esc(p.hotel.ejemplo)}.</p>
        <p class="math">${esc(p.hotel.matematica)}</p>
        <p class="nota">Fuentes: ${refs(p.hotel.fuentes)}</p>
      </div>`;

    const flights = `
      <div class="anexo-box">
        <h3>Vuelos</h3>
        <table class="anexo-itinerary">
          <thead><tr><th>Tramo</th><th>Fecha</th><th>Aerolínea</th><th>Escalas / duración</th><th>Precio</th></tr></thead>
          <tbody>${p.vuelos.map((f) => `<tr><td>${esc(f.tramo)}</td><td>${esc(f.fecha)}</td><td>${esc(f.aerolinea)}</td><td>${esc(f.escalas)} · ${esc(f.duracion)}</td><td>${esc(f.precio)} ${refs(f.fuentes)}</td></tr>`).join("")}</tbody>
        </table>
      </div>`;

    const formula = p.id === "turista"
      ? `<div class="anexo-formula">
          3 × ${money(c.adulto)} + ${money(c.nino)} = <em>${money(c.grupo)}</em><br>
          ${money(c.grupo)} ÷ ${p.dias} ÷ 4 = <em>${money(c.porDia)}</em>
          <small>Con vuelo: 3 × ${money(all.adulto)} + ${money(all.nino)} = ${money(all.grupo)}; ${money(all.porDia)} por persona/día.</small>
        </div>`
      : `<div class="anexo-formula">
          3 × ${money(c.adulto)} + ${money(c.nino)} = <em>${money(c.grupo)}</em><br>
          ${money(c.grupo)} ÷ ${p.dias} ÷ 4 = <em>${money(c.porDia)}</em>
          <small>${p.dias} días / ${p.noches} noches · precio por adulto, precio del niño y total del grupo.</small>
        </div>`;

    return `
      <section class="anexo-product" id="anexo-${p.id}">
        <div class="anexo-product-head">
          <div>
            <p class="tag">${esc(p.categoria)} · ${esc(p.alcance)}</p>
            <h2>${esc(p.nombre)}</h2>
            <p>${esc(p.resumen)}</p>
          </div>
          <div class="scope">${p.dias} días<br>${p.noches} noches<br>3 adultos + 1 niño de 12</div>
        </div>

        <div class="anexo-price-grid">
          <div class="anexo-price main"><span>Por adulto</span><b>${money(c.adulto)}</b><small>${p.id === "turista" ? "solo terreno" : "todo incluido"}</small></div>
          <div class="anexo-price"><span>Niño de 12</span><b>${money(c.nino)}</b><small>3+1 = 4 viajeros</small></div>
          <div class="anexo-price"><span>Grupo 3+1</span><b>${money(c.grupo)}</b><small>3 × adulto + niño</small></div>
          <div class="anexo-price"><span>Por día / persona</span><b>${money(c.porDia)}</b><small>promedio del grupo</small></div>
        </div>

        <div class="anexo-table-wrap">
          <table class="anexo-table">
            <caption>Rubros del paquete ${esc(p.nombre)}</caption>
            <thead><tr><th>Rubro</th><th>Adulto</th><th>Factor niño</th><th>Niño</th><th>Grupo 3+1</th><th>% adulto</th><th>Fuente</th></tr></thead>
            <tbody>${rows}${extra}</tbody>
          </table>
        </div>

        ${formula}

        <div class="anexo-two">${hotel}${flights}</div>

        <h3>Itinerario resumido</h3>
        <div class="anexo-table-wrap">
          <table class="anexo-itinerary">
            <thead><tr><th>Día</th><th>Fecha</th><th>Título</th><th>Zona</th></tr></thead>
            <tbody>${itinerary}</tbody>
          </table>
        </div>
        <p class="nota">El detalle narrativo, las fotos tipográficas y el selector en vivo están en <a href="./index.html#${p.id}">el sitio</a>.</p>
      </section>
    `;
  }

  function renderSources() {
    const tbody = document.querySelector("#anexo-fuentes-tabla tbody");
    tbody.innerHTML = DATA.fuentes.map((f) => `
      <tr id="fuente-${f.n}">
        <td>${f.n}</td>
        <td>${esc(f.grupo)}</td>
        <td><a href="${esc(f.url)}" target="_blank" rel="noopener noreferrer">${esc(f.titulo)}</a></td>
        <td>${esc(f.fecha)}</td>
        <td>${esc(f.uso)}</td>
      </tr>
    `).join("");
  }

  function renderChecks() {
    const items = [];
    PRODUCTS.forEach((p) => {
      const c = calc(p, false);
      const all = p.id === "turista" ? calc(p, true) : null;
      const okAdult = Math.abs(c.adulto - p.precioAdulto) < 1;
      const okChild = Math.abs(c.nino - p.precioNino) < 1;
      const okGroup = Math.abs(c.grupo - p.totalGrupo) < 1;
      const okDay = Math.abs(c.porDia - p.totalGrupo / p.dias / 4) < 0.01;
      const okTypical = Math.abs(p.diaTipico.total - p.diaTipico.lineas.reduce((s, l) => s + l.mxn, 0)) < 1;
      const okAsia = p.id !== "asia" || (p.precioAdulto >= 135000 && p.precioAdulto <= 165000);
      const okAll = p.id !== "turista" || (
        Math.abs(all.adulto - p.todoIncluidoAdulto) < 1 &&
        Math.abs(all.nino - p.todoIncluidoNino) < 1 &&
        Math.abs(all.grupo - p.todoIncluidoGrupo) < 1
      );
      const checks = [
        [okAdult, `${p.nombre}: suma de rubros = ${money(c.adulto)} por adulto.`],
        [okChild, `${p.nombre}: suma de rubros = ${money(c.nino)} para el niño de 12.`],
        [okGroup, `${p.nombre}: 3 × ${money(c.adulto)} + ${money(c.nino)} = ${money(c.grupo)}.`],
        [okDay, `${p.nombre}: ${money(c.grupo)} ÷ ${p.dias} ÷ 4 = ${money(c.porDia)}.`],
        [okTypical, `${p.nombre}: día típico suma ${money(p.diaTipico.total)}.`],
        [okAsia, `${p.nombre}: ${p.id === "asia" ? "precio dentro de la banda $135,000–$165,000." : "precio de lista coincide."}`],
        [okAll, `${p.nombre}: ${p.id === "turista" ? "total con vuelo cuadra." : "total todo incluido cuadra."}`]
      ];
      checks.forEach(([ok, text]) => items.push(`<li><span class="${ok ? "ok" : "bad"}">${ok ? "✓" : "×"}</span> ${esc(text)}</li>`));
    });
    document.getElementById("anexo-checks").innerHTML = items.join("");
  }

  document.querySelectorAll("[data-print]").forEach((btn) => btn.addEventListener("click", () => window.print()));

  renderCover();
  renderTotals();
  document.getElementById("anexo-productos").innerHTML = PRODUCTS.map(renderProduct).join("");
  renderSources();
  renderChecks();
})();
