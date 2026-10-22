#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Verificador del modelo de costos de Tokio en 15 días.

Lee precios.js (el único bloque de datos del sitio), comprueba la aritmética
y que cada referencia a fuente exista. No necesita dependencias externas.

Uso:
    python3 tools/verificar.py
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = ROOT / "precios.js"


def load_data():
    raw = DATA_FILE.read_text(encoding="utf-8").strip()
    prefix = "window.PRECIOS = "
    if not raw.startswith(prefix):
        raise ValueError("precios.js no empieza con 'window.PRECIOS = '")
    body = raw[len(prefix):].rstrip()
    if body.endswith(";"):
        body = body[:-1]
    return json.loads(body)


def calc(product, con_vuelo=False):
    cats = [dict(c) for c in product["categorias"]]
    if product["id"] == "turista" and con_vuelo:
        cats.insert(0, {
            "clave": "vuelo",
            "nombre": "Vuelo redondo",
            "adulto": product["vueloAdulto"],
            "factorNino": 1,
        })
    adult = sum(c["adulto"] for c in cats)
    child = sum(round(c["adulto"] * c["factorNino"]) for c in cats)
    return cats, adult, child, 3 * adult + child


def main():
    data = load_data()
    errors = []
    warnings = []
    products = data["productos"]
    sources = data["fuentes"]
    source_ids = {f["n"] for f in sources}

    if len(sources) != len(source_ids):
        errors.append("Hay números de fuente duplicados.")

    for f in sources:
        for key in ("n", "grupo", "titulo", "url", "fecha", "uso"):
            if not f.get(key):
                errors.append(f"Fuente {f.get('n')}: falta el campo {key}.")
        url = f.get("url", "")
        if not (url.startswith("http://") or url.startswith("https://") or url.startswith("#") or url.startswith("./")):
            errors.append(f"Fuente {f.get('n')}: URL no válida ({url}).")

    for pid in ("turista", "media", "alta", "asia"):
        if pid not in products:
            errors.append(f"Falta el producto {pid}.")
            continue
        p = products[pid]
        _, adult, child, group = calc(p, False)
        _, a_all, c_all, g_all = calc(p, True)

        if adult != p["precioAdulto"]:
            errors.append(f"{pid}: adulto {adult} != {p['precioAdulto']}.")
        if child != p["precioNino"]:
            errors.append(f"{pid}: niño {child} != {p['precioNino']}.")
        if group != p["totalGrupo"]:
            errors.append(f"{pid}: grupo {group} != {p['totalGrupo']}.")
        if abs(group / p["dias"] / 4 - p["totalGrupo"] / p["dias"] / 4) > 0.01:
            errors.append(f"{pid}: costo por día no cuadra.")
        if p["id"] == "turista":
            if a_all != p["todoIncluidoAdulto"]:
                errors.append("turista: adulto con vuelo no cuadra.")
            if c_all != p["todoIncluidoNino"]:
                errors.append("turista: niño con vuelo no cuadra.")
            if g_all != p["todoIncluidoGrupo"]:
                errors.append("turista: grupo con vuelo no cuadra.")
        if p["id"] == "asia" and not (135000 <= p["precioAdulto"] <= 165000):
            errors.append("asia: fuera de la banda $135,000–$165,000.")

        typical = sum(l["mxn"] for l in p["diaTipico"]["lineas"])
        if typical != p["diaTipico"]["total"]:
            errors.append(f"{pid}: día típico {typical} != {p['diaTipico']['total']}.")
        if p["hotel"].get("fuentes"):
            for n in p["hotel"]["fuentes"]:
                if n not in source_ids:
                    errors.append(f"{pid}: fuente de hotel {n} no existe.")
        for c in p["categorias"]:
            for n in c.get("fuentes", []):
                if n not in source_ids:
                    errors.append(f"{pid}: fuente {n} de {c['clave']} no existe.")
        for f in p["vuelos"]:
            for n in f.get("fuentes", []):
                if n not in source_ids:
                    errors.append(f"{pid}: fuente {n} de vuelo no existe.")
        for a in p["actividades"]:
            if a.get("fuente") and a["fuente"] not in source_ids:
                errors.append(f"{pid}: fuente {a['fuente']} de actividad no existe.")

    for v in data["asia"]["visas"]:
        if v.get("fuente") not in source_ids:
            errors.append(f"visa {v['pais']}: fuente {v.get('fuente')} no existe.")
    for c in data["asia"]["ciudades"]:
        if c["noches"] <= 0:
            errors.append(f"Asia: {c['nombre']} sin noches.")
    nights = sum(c["noches"] for c in data["asia"]["ciudades"])
    if nights != products["asia"]["noches"]:
        errors.append(f"Asia: noches {nights} != {products['asia']['noches']}.")
    if [c["nombre"] for c in data["asia"]["ciudades"]] != ["Tokio", "Seúl", "Bangkok", "Hanói", "Singapur"]:
        errors.append("Asia: el orden de ciudades no es el decidido.")

    if data["meta"]["viajeros"] != {"adultos": 3, "ninos": 1, "edadNino": 12, "total": 4}:
        errors.append("Meta: la composición del grupo no es 3 adultos + 1 niño de 12.")

    print("Tokio en 15 días · verificación del modelo")
    print(f"Productos: {len(products)} · Fuentes: {len(sources)}")
    for pid in ("turista", "media", "alta", "asia"):
        p = products[pid]
        print(f"  {pid:8s} adulto ${p['precioAdulto']:>8,} · niño ${p['precioNino']:>8,} · grupo ${p['totalGrupo']:>9,} · día ${p['totalGrupo']/p['dias']/4:,.0f}")
    if warnings:
        print("\nAdvertencias:")
        for w in warnings:
            print("  -", w)
    if errors:
        print("\nERRORES:")
        for e in errors:
            print("  -", e)
        return 1
    print("\nOK: la aritmética cuadra y todas las referencias a fuentes existen.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
