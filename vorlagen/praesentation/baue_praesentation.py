# -*- coding: utf-8 -*-
"""Praesentations-Generator der ai-firma (V2).

Aufruf:  python vorlagen/praesentation/baue_praesentation.py <konfig.json> <ziel.pptx>
(aus der Repo-Wurzel). Schema der Konfig: siehe ANLEITUNG.md.
V2: gezeichnete UI-Mockups statt Screenshots, Business-Folie (Abteilungen vs. System),
OS-Flow-Diagramm, Modell-Treppe, **fett**-Auszeichnung, keine Schatten, keine Gedankenstriche.
"""
import json
import sys
from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.util import Inches, Pt

BREITE, HOEHE = Inches(13.333), Inches(7.5)
SERIF, SANS = "Georgia", "Segoe UI"
WEISS = RGBColor.from_string("FFFFFF")


def farbe(hexwert):
    return RGBColor.from_string(hexwert.lstrip("#"))


def lade_konfig(pfad):
    with open(pfad, encoding="utf-8") as f:
        k = json.load(f)
    std = {"gruen": "#2F7D43", "gelb": "#B9861A", "gold": "#B08D57",
           "hellgrau": "#E4E0D9", "linie": "#E5E3DF"}
    for name, wert in std.items():
        k["farben"].setdefault(name, wert)
    k["_f"] = {name: farbe(wert) for name, wert in k["farben"].items()}
    return k


# ---------- Basis-Helfer ----------

def leere_folie(prs, hintergrund):
    folie = prs.slides.add_slide(prs.slide_layouts[6])
    folie.background.fill.solid()
    folie.background.fill.fore_color.rgb = hintergrund
    return folie


def absatz_fuellen(p, text, groesse, farbe_rgb, fett, font):
    """Fuellt einen Absatz; **teil** wird fett gesetzt."""
    for i, teil in enumerate(str(text).split("**")):
        if not teil:
            continue
        lauf = p.add_run()
        lauf.text = teil
        lauf.font.size = Pt(groesse)
        lauf.font.color.rgb = farbe_rgb
        lauf.font.bold = fett or (i % 2 == 1)
        lauf.font.name = font


def textbox(folie, x, y, b, h, text, groesse, farbe_rgb, *, fett=False,
            font=SANS, zentriert=False, zeilen=None, anker=MSO_ANCHOR.TOP,
            abstand=6):
    box = folie.shapes.add_textbox(x, y, b, h)
    tf = box.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anker
    eintraege = zeilen if zeilen is not None else [(text, groesse, farbe_rgb, fett, font)]
    for i, (t, g, c, f, fo) in enumerate(eintraege):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = PP_ALIGN.CENTER if zentriert else PP_ALIGN.LEFT
        p.space_after = Pt(abstand)
        absatz_fuellen(p, t, g, c, f, fo)
    return box


def kachel(folie, x, y, b, h, fuellung, rand=None, radius=0.06, randstaerke=1.0):
    form = folie.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, b, h)
    form.adjustments[0] = radius
    form.fill.solid()
    form.fill.fore_color.rgb = fuellung
    if rand:
        form.line.color.rgb = rand
        form.line.width = Pt(randstaerke)
    else:
        form.line.fill.background()
    form.shadow.inherit = False
    return form


def pfeil(folie, x, y, b, h, fuellung):
    form = folie.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, x, y, b, h)
    form.fill.solid()
    form.fill.fore_color.rgb = fuellung
    form.line.fill.background()
    form.shadow.inherit = False
    return form


def wortmarke(folie, k, x, y, groesse=18):
    box = folie.shapes.add_textbox(x, y, Inches(2.3), Inches(0.5))
    p = box.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.RIGHT
    r1 = p.add_run(); r1.text = k["kunde"].upper()
    r1.font.name = SERIF; r1.font.bold = True; r1.font.size = Pt(groesse)
    r1.font.color.rgb = k["_f"]["tinte"]
    r2 = p.add_run(); r2.text = " ●"
    r2.font.size = Pt(int(groesse * 0.55)); r2.font.color.rgb = k["_f"]["akzent"]
    return box


def kopfzeile(folie, k, titel, untertitel=None):
    kachel(folie, 0, 0, BREITE, Inches(0.14), k["_f"]["akzent"], radius=0.0)
    textbox(folie, Inches(0.6), Inches(0.4), Inches(9.6), Inches(0.85),
            titel, 29, k["_f"]["tinte"], fett=True, font=SERIF)
    if untertitel:
        textbox(folie, Inches(0.6), Inches(1.08), Inches(9.6), Inches(0.5),
                untertitel, 13.5, k["_f"]["grau"])
    wortmarke(folie, k, Inches(10.4), Inches(0.45))


# ---------- Gezeichnete Handy-Mockups ----------

def _mini(folie, x, y, b, h, text, g, c, *, fett=False, zentriert=True,
          anker=MSO_ANCHOR.MIDDLE):
    box = textbox(folie, x, y, b, h, text, g, c, fett=fett,
                  zentriert=zentriert, anker=anker, abstand=1)
    box.text_frame.margin_left = box.text_frame.margin_right = Inches(0.04)
    box.text_frame.margin_top = box.text_frame.margin_bottom = Inches(0.02)
    return box


def phone(folie, k, x, y, typ, b=Inches(2.9), h=Inches(5.0)):
    f = k["_f"]
    kachel(folie, x, y, b, h, f["tinte"], radius=0.09)
    sx, sy = x + Inches(0.12), y + Inches(0.12)
    sb, sh = b - Inches(0.24), h - Inches(0.24)
    kachel(folie, sx, sy, sb, sh, f["papier"], radius=0.07)
    _mini(folie, sx + Inches(0.12), sy + Inches(0.08), sb - Inches(0.24), Inches(0.3),
          k["kunde"].upper() + " ●", 10, f["tinte"], fett=True, zentriert=False)
    cy = sy + Inches(0.48)
    cx = sx + Inches(0.14)
    cb = sb - Inches(0.28)
    if typ == "uebersicht":
        dr = (cb - Inches(0.12)) / 3
        for i, (n, l, c) in enumerate([("3", "gut", f["gruen"]), ("3", "knapp", f["gelb"]), ("2", "leer", f["akzent"])]):
            tx = cx + i * (dr + Inches(0.06))
            kachel(folie, tx, cy, dr, Inches(0.72), WEISS, rand=f["linie"])
            _mini(folie, tx, cy + Inches(0.04), dr, Inches(0.4), n, 17, c, fett=True)
            _mini(folie, tx, cy + Inches(0.42), dr, Inches(0.25), l, 7.5, f["grau"])
        cy += Inches(0.88)
        kachel(folie, cx, cy, cb, Inches(0.85), WEISS, rand=f["linie"])
        _mini(folie, cx + Inches(0.1), cy + Inches(0.06), cb - Inches(0.2), Inches(0.3),
              "Heute", 9, f["tinte"], fett=True, zentriert=False)
        _mini(folie, cx + Inches(0.1), cy + Inches(0.34), cb - Inches(0.2), Inches(0.45),
              "**14** Verkäufe   ·   **3** Bestellungen", 9, f["tinte"], zentriert=False)
        cy += Inches(1.0)
        kachel(folie, cx, cy, cb, Inches(1.5), WEISS, rand=f["akzent"], randstaerke=1.5)
        _mini(folie, cx + Inches(0.1), cy + Inches(0.06), cb - Inches(0.2), Inches(0.3),
              "KI-Vorschlag", 9, f["akzent"], fett=True, zentriert=False)
        _mini(folie, cx + Inches(0.1), cy + Inches(0.36), cb - Inches(0.2), Inches(0.6),
              "Hoodie M in Zürich leer. 12 nachbestellen?", 8.5, f["tinte"], zentriert=False,
              anker=MSO_ANCHOR.TOP)
        bb2 = (cb - Inches(0.3)) / 2
        kachel(folie, cx + Inches(0.1), cy + Inches(1.02), bb2, Inches(0.36), f["akzent"], radius=0.25)
        _mini(folie, cx + Inches(0.1), cy + Inches(1.02), bb2, Inches(0.36), "Übernehmen", 8, WEISS, fett=True)
        kachel(folie, cx + Inches(0.2) + bb2, cy + Inches(1.02), bb2, Inches(0.36), f["hellgrau"], radius=0.25)
        _mini(folie, cx + Inches(0.2) + bb2, cy + Inches(1.02), bb2, Inches(0.36), "Ablehnen", 8, f["tinte"])
    elif typ == "scan":
        kachel(folie, cx, cy, cb, Inches(0.5), WEISS, rand=f["linie"])
        kachel(folie, cx + Inches(0.1), cy + Inches(0.12), Inches(0.5), Inches(0.26), f["akzent"], radius=0.5)
        _mini(folie, cx + Inches(0.68), cy, cb - Inches(0.7), Inches(0.5),
              "Test: WLAN ausgeschaltet", 8.5, f["tinte"], zentriert=False)
        cy += Inches(0.66)
        kachel(folie, cx, cy, cb, Inches(0.75), f["akzent"], radius=0.12)
        _mini(folie, cx, cy, cb, Inches(0.75), "Artikel scannen", 12, WEISS, fett=True)
        cy += Inches(0.9)
        kachel(folie, cx, cy, cb, Inches(0.6), WEISS, rand=f["linie"])
        _mini(folie, cx + Inches(0.1), cy, cb - Inches(0.2), Inches(0.6),
              "**Eingebucht:** 1x Tee Box-Logo M", 8.5, f["gruen"], zentriert=False)
        cy += Inches(0.76)
        kachel(folie, cx, cy, cb, Inches(1.05), farbe("F5ECD9"), rand=f["gelb"])
        _mini(folie, cx + Inches(0.1), cy + Inches(0.08), cb - Inches(0.2), Inches(0.9),
              "**Warteschlange: 1 Buchung.** Wird automatisch nachgebucht, sobald WLAN da ist.",
              8.5, farbe("7A5C12"), zentriert=False, anker=MSO_ANCHOR.TOP)
    elif typ == "chat":
        dialog = [("Wo liegt Hoodie M?", True), ("Zürich 0, Embrach 4. Regal B, Fach 3.", False),
                  ("Was ist knapp?", True), ("Cap Sport und Beanie Logo.", False)]
        for text, ich in dialog:
            bw = int(cb * 0.82)
            bx = cx + (cb - bw) if ich else cx
            hh = Inches(0.55)
            kachel(folie, bx, cy, bw, hh, f["tinte"] if ich else WEISS,
                   rand=None if ich else f["linie"], radius=0.3)
            _mini(folie, bx + Inches(0.1), cy, bw - Inches(0.2), hh, text, 8.5,
                  WEISS if ich else f["tinte"], zentriert=False)
            cy += hh + Inches(0.14)
        kachel(folie, cx, sy + sh - Inches(0.55), cb, Inches(0.4), WEISS, rand=f["linie"], radius=0.3)
        _mini(folie, cx + Inches(0.12), sy + sh - Inches(0.55), cb - Inches(0.24), Inches(0.4),
              "Frage eingeben", 8.5, f["grau"], zentriert=False)


# ---------- Folien ----------

def slide_titel(prs, k):
    f = leere_folie(prs, k["_f"]["tinte"])
    kachel(f, 0, HOEHE - Inches(0.14), BREITE, Inches(0.14), k["_f"]["akzent"], radius=0.0)
    box = textbox(f, Inches(1.2), Inches(2.4), Inches(11), Inches(1.4), "", 54, WEISS)
    p = box.text_frame.paragraphs[0]
    r1 = p.add_run(); r1.text = k["kunde"].upper()
    r1.font.name = SERIF; r1.font.bold = True; r1.font.size = Pt(54); r1.font.color.rgb = WEISS
    r2 = p.add_run(); r2.text = " ●"
    r2.font.size = Pt(30); r2.font.color.rgb = k["_f"]["akzent"]
    textbox(f, Inches(1.2), Inches(3.8), Inches(10.5), Inches(0.9),
            k["claim"], 22, farbe("D8D6DC"), font=SERIF)
    textbox(f, Inches(1.2), Inches(6.2), Inches(10), Inches(0.6),
            k["untertitel_titelfolie"] + "   ·   " + k["datum"], 13, farbe("9A97A0"))


def slide_momente(prs, k):
    f = leere_folie(prs, k["_f"]["papier"])
    m = k["momente"]
    kopfzeile(f, k, m["titel"], m.get("untertitel"))
    b = Inches(3.9); x = Inches(0.6)
    for eintrag in m["punkte"]:
        kachel(f, x, Inches(1.8), b, Inches(2.5), WEISS, rand=k["_f"]["linie"])
        textbox(f, x + Inches(0.28), Inches(2.05), b - Inches(0.56), Inches(2.1), "", 14,
                k["_f"]["tinte"],
                zeilen=[(eintrag["kopf"], 15, k["_f"]["akzent"], True, SANS),
                        (eintrag["text"], 13, k["_f"]["tinte"], False, SANS)])
        x += b + Inches(0.31)
    s = m["stat"]
    kachel(f, Inches(0.6), Inches(4.7), Inches(12.13), Inches(2.1), k["_f"]["tinte"])
    textbox(f, Inches(1.0), Inches(5.15), Inches(3.9), Inches(1.2),
            s["wert"], 38, WEISS, fett=True, font=SERIF)
    textbox(f, Inches(4.8), Inches(5.1), Inches(7.6), Inches(0.6),
            s["text"], 16, WEISS, fett=True)
    bx, by, bb = Inches(4.8), Inches(5.85), Inches(6.6)
    kachel(f, bx, by, bb, Inches(0.3), farbe("3A3841"), radius=0.5)
    kachel(f, bx, by, int(bb * s["anteil"]), Inches(0.3), k["_f"]["akzent"], radius=0.5)
    textbox(f, Inches(4.8), Inches(6.3), Inches(7.6), Inches(0.4),
            "Quelle: " + s["quelle"], 10.5, farbe("9A97A0"))


def slide_prinzipien(prs, k):
    f = leere_folie(prs, k["_f"]["papier"])
    p = k["prinzipien"]
    kopfzeile(f, k, p["titel"], p.get("untertitel"))
    b = Inches(3.9); x = Inches(0.6)
    for i, eintrag in enumerate(p["punkte"], 1):
        kachel(f, x, Inches(2.0), b, Inches(3.9), WEISS, rand=k["_f"]["linie"])
        kachel(f, x + Inches(0.28), Inches(2.3), Inches(0.55), Inches(0.55), k["_f"]["akzent"])
        textbox(f, x + Inches(0.28), Inches(2.34), Inches(0.55), Inches(0.5),
                str(i), 20, WEISS, fett=True, zentriert=True)
        textbox(f, x + Inches(0.28), Inches(3.1), b - Inches(0.56), Inches(2.6), "", 14,
                k["_f"]["tinte"],
                zeilen=[(eintrag["kopf"], 18, k["_f"]["tinte"], True, SERIF),
                        (eintrag["text"], 13, k["_f"]["grau"], False, SANS)])
        x += b + Inches(0.31)


def slide_business(prs, k):
    f = leere_folie(prs, k["_f"]["papier"])
    a = k["abteilungen"]
    kopfzeile(f, k, a["titel"], a.get("untertitel"))
    textbox(f, Inches(0.6), Inches(1.75), Inches(5.4), Inches(0.5),
            a["links_titel"], 14, k["_f"]["tinte"], fett=True)
    bb, bh = Inches(2.6), Inches(0.85)
    for i, name in enumerate(a["liste"]):
        x = Inches(0.6) + (i % 2) * (bb + Inches(0.2))
        y = Inches(2.35) + (i // 2) * (bh + Inches(0.18))
        kachel(f, x, y, bb, bh, k["_f"]["hellgrau"])
        textbox(f, x, y, bb, bh, name, 12.5, k["_f"]["tinte"], fett=True,
                zentriert=True, anker=MSO_ANCHOR.MIDDLE)
    pfeil(f, Inches(6.35), Inches(4.0), Inches(1.0), Inches(0.7), k["_f"]["akzent"])
    kachel(f, Inches(7.7), Inches(2.35), Inches(5.0), Inches(3.94), k["_f"]["tinte"])
    textbox(f, Inches(8.1), Inches(2.9), Inches(4.2), Inches(3.2), "", 16, WEISS,
            zeilen=[(a["rechts_titel"], 24, WEISS, True, SERIF),
                    ("", 8, WEISS, False, SANS),
                    (a["rechts_text"], 14.5, farbe("D8D6DC"), False, SANS)])
    textbox(f, Inches(0.6), Inches(6.7), Inches(12.1), Inches(0.5),
            a.get("fusszeile", ""), 12, k["_f"]["grau"])


def slide_os_flow(prs, k):
    f = leere_folie(prs, k["_f"]["papier"])
    o = k["os_flow"]
    kopfzeile(f, k, o["titel"], o.get("untertitel"))
    textbox(f, Inches(0.6), Inches(1.9), Inches(3.2), Inches(0.4),
            o["links_titel"], 13, k["_f"]["grau"], fett=True)
    y = Inches(2.4)
    for name in o["systeme"]:
        kachel(f, Inches(0.6), y, Inches(3.0), Inches(0.75), WEISS, rand=k["_f"]["linie"])
        textbox(f, Inches(0.6), y, Inches(3.0), Inches(0.75), name, 13, k["_f"]["tinte"],
                fett=True, zentriert=True, anker=MSO_ANCHOR.MIDDLE)
        y += Inches(0.95)
    pfeil(f, Inches(3.85), Inches(3.7), Inches(0.85), Inches(0.55), k["_f"]["grau"])
    kachel(f, Inches(4.95), Inches(2.7), Inches(3.5), Inches(2.6), k["_f"]["akzent"], radius=0.1)
    textbox(f, Inches(5.1), Inches(3.35), Inches(3.2), Inches(1.6), "", 14, WEISS,
            zentriert=True,
            zeilen=[(o["os_name"], 17, WEISS, True, SANS),
                    (o["os_sub"], 13, farbe("F0C9C3"), False, SANS)])
    pfeil(f, Inches(8.7), Inches(3.7), Inches(0.85), Inches(0.55), k["_f"]["grau"])
    textbox(f, Inches(9.8), Inches(1.9), Inches(3.0), Inches(0.4),
            o["rechts_titel"], 13, k["_f"]["grau"], fett=True)
    y = Inches(2.4)
    for eintrag in o["menschen"]:
        kachel(f, Inches(9.8), y, Inches(3.0), Inches(1.3), k["_f"]["tinte"])
        textbox(f, Inches(9.95), y + Inches(0.18), Inches(2.7), Inches(1.0), "", 12, WEISS,
                zeilen=[(eintrag["wer"], 14, WEISS, True, SANS),
                        (eintrag["was"], 12, farbe("B7B4BD"), False, SANS)])
        y += Inches(1.55)
    textbox(f, Inches(0.6), Inches(6.7), Inches(12.1), Inches(0.5),
            o.get("fusszeile", ""), 12.5, k["_f"]["tinte"], fett=True)


def slide_mockup(prs, k, m):
    f = leere_folie(prs, k["_f"]["papier"])
    kopfzeile(f, k, m["titel"], m.get("untertitel"))
    phone(f, k, Inches(1.3), Inches(1.9), m["typ"])
    y = Inches(2.4)
    for punkt in m["punkte"]:
        kachel(f, Inches(5.2), y, Inches(0.14), Inches(0.95), k["_f"]["akzent"], radius=0.5)
        textbox(f, Inches(5.6), y, Inches(7.1), Inches(1.1), punkt, 16, k["_f"]["tinte"])
        y += Inches(1.35)


def slide_schritte(prs, k):
    f = leere_folie(prs, k["_f"]["papier"])
    s = k["schritte"]
    kopfzeile(f, k, s["titel"], s.get("untertitel"))
    n = len(s["punkte"])
    bb = Inches(3.05); x = Inches(0.6)
    for i, eintrag in enumerate(s["punkte"], 1):
        chv = f.shapes.add_shape(MSO_SHAPE.CHEVRON, x, Inches(2.1), bb, Inches(0.85))
        chv.adjustments[0] = 0.35
        chv.fill.solid()
        chv.fill.fore_color.rgb = k["_f"]["akzent"] if i == n else k["_f"]["tinte"]
        chv.line.fill.background()
        chv.shadow.inherit = False
        textbox(f, x + Inches(0.35), Inches(2.22), bb - Inches(0.6), Inches(0.6),
                str(i) + "   " + eintrag["kopf"], 15, WEISS, fett=True)
        textbox(f, x + Inches(0.1), Inches(3.25), bb - Inches(0.35), Inches(2.6),
                eintrag["text"], 13, k["_f"]["grau"])
        x += bb + Inches(0.03)
    textbox(f, Inches(0.6), Inches(6.5), Inches(12.1), Inches(0.6),
            s.get("fusszeile", ""), 13.5, k["_f"]["tinte"], fett=True)


def slide_modelle_visual(prs, k):
    f = leere_folie(prs, k["_f"]["papier"])
    m = k["modelle"]
    kopfzeile(f, k, m["titel"], m.get("untertitel"))
    basis_y = Inches(6.45)
    hoehen = [Inches(2.7), Inches(3.2), Inches(3.7)]
    bb = Inches(3.7); x = Inches(0.75)
    stile = {
        "hell":   {"fill": k["_f"]["hellgrau"], "text": k["_f"]["tinte"], "sub": k["_f"]["grau"]},
        "akzent": {"fill": k["_f"]["akzent"],   "text": WEISS,            "sub": farbe("F0C9C3")},
        "dunkel": {"fill": k["_f"]["tinte"],    "text": k["_f"]["gold"],  "sub": farbe("B7B4BD")},
    }
    for modell, h in zip(m["liste"], hoehen):
        st = stile[modell["stil"]]
        y = basis_y - h
        kachel(f, x, y, bb, h, st["fill"], radius=0.03)
        if modell["stil"] == "dunkel":
            kachel(f, x, y, bb, Inches(0.09), k["_f"]["gold"], radius=0.0)
        textbox(f, x + Inches(0.3), y + Inches(0.25), bb - Inches(0.6), h - Inches(0.4), "", 13,
                st["text"],
                zeilen=[(modell["stufe"], 12, st["sub"], True, SANS),
                        (modell["name"], 21, st["text"], True, SERIF),
                        (modell["preis"], 26, st["text"], True, SANS),
                        (m["preis_einheit"], 12, st["sub"], False, SANS),
                        ("", 6, st["sub"], False, SANS),
                        (modell["kurz"], 12.5, st["sub"], False, SANS)])
        if modell.get("empfohlen"):
            kachel(f, x + Inches(0.3), y - Inches(0.28), Inches(1.85), Inches(0.48), k["_f"]["tinte"])
            textbox(f, x + Inches(0.3), y - Inches(0.25), Inches(1.85), Inches(0.42),
                    m["empfehlung_etikett"], 11.5, WEISS, fett=True, zentriert=True)
        x += bb + Inches(0.35)
    textbox(f, Inches(0.75), Inches(6.65), Inches(12), Inches(0.5),
            m.get("fusszeile", ""), 11.5, k["_f"]["grau"])


def slide_klartext(prs, k, modell, einheit):
    f = leere_folie(prs, k["_f"]["papier"])
    kopfzeile(f, k, modell["name"],
              modell["preis"] + " " + einheit + ("   ·   " + modell["zusatz"] if modell.get("zusatz") else ""))
    y = Inches(1.95)
    for feat in modell["features"]:
        kachel(f, Inches(0.6), y, Inches(3.55), Inches(0.75), WEISS, rand=k["_f"]["linie"])
        textbox(f, Inches(0.85), y, Inches(3.2), Inches(0.75), feat["name"], 14,
                k["_f"]["akzent"], fett=True, anker=MSO_ANCHOR.MIDDLE)
        textbox(f, Inches(4.55), y + Inches(0.08), Inches(8.2), Inches(0.7),
                feat["klartext"], 13.5, k["_f"]["tinte"])
        y += Inches(0.95)


def slide_rollen(prs, k):
    f = leere_folie(prs, k["_f"]["papier"])
    r = k["rollen"]
    kopfzeile(f, k, r["titel"], r.get("untertitel"))
    b = Inches(3.9); x = Inches(0.6)
    for eintrag in r["punkte"]:
        kachel(f, x, Inches(2.1), b, Inches(3.4), WEISS, rand=k["_f"]["linie"])
        textbox(f, x + Inches(0.3), Inches(2.45), b - Inches(0.6), Inches(2.8), "", 14,
                k["_f"]["tinte"],
                zeilen=[(eintrag["wer"], 15, k["_f"]["akzent"], True, SANS),
                        (eintrag["text"], 15, k["_f"]["tinte"], False, SANS)])
        x += b + Inches(0.31)
    textbox(f, Inches(0.6), Inches(6.2), Inches(12.1), Inches(0.6),
            r.get("fusszeile", ""), 13.5, k["_f"]["tinte"], fett=True)


def slide_abschluss(prs, k):
    f = leere_folie(prs, k["_f"]["tinte"])
    a = k["abschluss"]
    kachel(f, 0, 0, BREITE, Inches(0.14), k["_f"]["akzent"], radius=0.0)
    textbox(f, Inches(1.2), Inches(1.7), Inches(11), Inches(1.2),
            a["titel"], 40, WEISS, fett=True, font=SERIF)
    y = Inches(3.3)
    for punkt in a["punkte"]:
        kachel(f, Inches(1.2), y + Inches(0.06), Inches(0.12), Inches(0.5), k["_f"]["akzent"], radius=0.5)
        textbox(f, Inches(1.6), y, Inches(10.4), Inches(0.7), punkt, 17, farbe("D8D6DC"))
        y += Inches(0.85)
    textbox(f, Inches(1.2), Inches(6.4), Inches(10.8), Inches(0.6),
            a.get("fusszeile", ""), 13, farbe("9A97A0"))


def baue_deck(konfig_pfad, ziel_pfad):
    k = lade_konfig(konfig_pfad)
    prs = Presentation()
    prs.slide_width, prs.slide_height = BREITE, HOEHE
    slide_titel(prs, k)
    slide_momente(prs, k)
    slide_prinzipien(prs, k)
    if k.get("abteilungen"):
        slide_business(prs, k)
    if k.get("os_flow"):
        slide_os_flow(prs, k)
    for m in k.get("mockups", []):
        slide_mockup(prs, k, m)
    slide_schritte(prs, k)
    slide_modelle_visual(prs, k)
    for modell in k["modelle"]["liste"]:
        slide_klartext(prs, k, modell, k["modelle"]["preis_einheit"])
    slide_rollen(prs, k)
    slide_abschluss(prs, k)
    Path(ziel_pfad).parent.mkdir(parents=True, exist_ok=True)
    prs.save(ziel_pfad)
    print(f"OK: {ziel_pfad} ({len(prs.slides._sldIdLst)} Folien)")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit("Aufruf: python baue_praesentation.py <konfig.json> <ziel.pptx>")
    baue_deck(sys.argv[1], sys.argv[2])
