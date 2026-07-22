# -*- coding: utf-8 -*-
"""Liest den Shopify-Produktexport, zeigt den Stand und baut eine kleine Pilot-CSV."""
import csv
import os

QUELLE = r"C:\Projects\AIWorks\ai-firma\kunden\finelli\products_export_1.csv"
SP = os.path.dirname(os.path.abspath(__file__))
ZIEL = os.path.join(SP, "finelli-pilot.csv")

# Die Artikel des Pilots: Zwischengestell 1 Seite A + Front 1.
# Exakte Titel aus dem Shopify-Export, sonst greifen Teiltreffer wie
# "Starter Box" oder "Reach for the Stars" mit.
PILOT = [
    ("rockstar tee black",                           "ZG1-A1"),
    ("rockstar tee white",                           "ZG1-A2"),
    ("ornament tee blue",                            "ZG1-A3"),
    ("ornament tee green",                           "ZG1-A4"),
    ("star t-shirt",                                 "ZG1-A5"),
    ("i'm a zurich baby t-shirt",                    "ZG1-A6"),
    ("finelli i need a hug from a swiss baddie cap",  "ZG1-F1"),
    ("finelli pant chain",                           "ZG1-F1"),
    ("finelli amber brown sunglasses",               "ZG1-F1"),
    ("finelli turtoise sunglasses",                  "ZG1-F1"),
    ("finelli retro brown sunglasses",               "ZG1-F1"),
    ("finelli leather duffle bag",                   "ZG1-F1"),
    ("brown finelli leather duffle bag",             "ZG1-F1"),
]

csv.field_size_limit(10000000)
with open(QUELLE, "r", encoding="utf-8-sig", newline="") as f:
    leser = csv.DictReader(f)
    kopf = leser.fieldnames or []
    zeilen = list(leser)

print("SPALTEN (%d): %s" % (len(kopf), ", ".join(kopf[:18])))
print("ZEILEN: %d" % len(zeilen))

def w(z, name):
    return (z.get(name) or "").strip()

produkte, mit_bc, ohne_bc = {}, 0, 0
letzter = ""
for z in zeilen:
    t = w(z, "Title") or letzter
    if t:
        letzter = t
    h = w(z, "Handle")
    if h:
        produkte.setdefault(h, {"titel": t, "varianten": 0, "bc": 0,
                                "status": w(z, "Status"), "typ": w(z, "Type")})
    if h and w(z, "Option1 Value"):
        produkte[h]["varianten"] += 1
        if w(z, "Variant Barcode"):
            produkte[h]["bc"] += 1
            mit_bc += 1
        else:
            ohne_bc += 1

aktive = sum(1 for p in produkte.values() if p["status"].lower() == "active")
print("PRODUKTE: %d (davon aktiv: %d)" % (len(produkte), aktive))
print("VARIANTEN: %d  |  mit Barcode: %d  |  ohne Barcode: %d" % (mit_bc + ohne_bc, mit_bc, ohne_bc))
print("")

print("=== PILOT-ARTIKEL im Katalog ===")
handles = set()
fehlend = []
for muster, fach in PILOT:
    passend = [(h, p) for h, p in produkte.items() if p["titel"].lower().strip() == muster]
    if not passend:
        print("  %-8s %-46s NICHT IN SHOPIFY" % (fach, muster))
        fehlend.append((muster, fach))
        continue
    for h, p in passend:
        handles.add(h)
        print("  %-8s %-46s %2d Var, %2d mit Barcode, %s" %
              (fach, p["titel"][:46], p["varianten"], p["bc"], p["status"]))
print("")
if fehlend:
    print("!! %d Artikel fehlen in Shopify und muessen dort erst angelegt werden:" % len(fehlend))
    for m, f in fehlend:
        print("   %s  (Fach %s)" % (m, f))
    print("")

spalten = ["Handle", "Title", "Option1 Name", "Option1 Value", "Option2 Name", "Option2 Value",
           "Variant SKU", "Variant Price", "Variant Barcode", "Status"]
raus, letzter_h = [], ""
for z in zeilen:
    h = w(z, "Handle") or letzter_h
    if h:
        letzter_h = h
    if h in handles:
        raus.append(dict((s, w(z, s)) for s in spalten))

with open(ZIEL, "w", encoding="utf-8", newline="") as f:
    schr = csv.DictWriter(f, fieldnames=spalten)
    schr.writeheader()
    for r in raus:
        schr.writerow(r)

var = len([r for r in raus if r["Option1 Value"]])
print("PILOT-CSV: %s" % ZIEL)
print("  %d Zeilen, %d Varianten, %d Produkte, %d Byte"
      % (len(raus), var, len(handles), os.path.getsize(ZIEL)))
print("")
print("=== Varianten im Pilot ===")
for r in raus:
    if r["Option1 Value"]:
        print("  %-40s %-10s %-14s %s" % ((r["Title"] or "(gleicher Artikel)")[:40],
              r["Option1 Value"][:10], r["Variant SKU"][:14], r["Variant Barcode"] or "KEIN BARCODE"))
