# -*- coding: utf-8 -*-
"""Praesentations-Generator der ai-firma.

Aufruf:  python baue_praesentation.py <konfig.json> <ziel.pptx>
Liest eine Kunden-Konfig (JSON, Schema siehe ANLEITUNG.md) und baut ein
16:9-Deck im Firmen-Stil. Kunden-sichtbarer Text kommt 1:1 aus der Konfig
(echte Umlaute, Schweizer ss — Regel des Workspace).
"""
import json
import sys
from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.util import Emu, Inches, Pt

BREITE, HOEHE = Inches(13.333), Inches(7.5)
SERIF, SANS = "Georgia", "Segoe UI"


def farbe(hexwert):
    return RGBColor.from_string(hexwert.lstrip("#"))


def lade_konfig(pfad):
    with open(pfad, encoding="utf-8") as f:
        k = json.load(f)
    k["_f"] = {name: farbe(wert) for name, wert in k["farben"].items()}
    return k


# ---------- Bau-Helfer ----------

def leere_folie(prs, hintergrund):
    folie = prs.slides.add_slide(prs.slide_layouts[6])
    folie.background.fill.solid()
    folie.background.fill.fore_color.rgb = hintergrund
    return folie


def textbox(folie, x, y, b, h, text, groesse, farbe_rgb, *, fett=False,
            font=SANS, zentriert=False, zeilen=None, anker=MSO_ANCHOR.TOP):
    box = folie.shapes.add_textbox(x, y, b, h)
    tf = box.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anker
    eintraege = zeilen if zeilen is not None else [(text, groesse, farbe_rgb, fett, font)]
    for i, (t, g, c, f, fo) in enumerate(eintraege):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = PP_ALIGN.CENTER if zentriert else PP_ALIGN.LEFT
        p.space_after = Pt(6)
        lauf = p.add_run()
        lauf.text = t
        lauf.font.size = Pt(g)
        lauf.font.color.rgb = c
        lauf.font.bold = f
        lauf.font.name = fo
    return box


def kachel(folie, x, y, b, h, fuellung, rand=None):
    from pptx.enum.shapes import MSO_SHAPE
    form = folie.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, b, h)
    form.adjustments[0] = 0.045
    form.fill.solid()
    form.fill.fore_color.rgb = fuellung
    if rand:
        form.line.color.rgb = rand
        form.line.width = Pt(1.25)
    else:
        form.line.fill.background()
    form.shadow.inherit = False
    return form


def wortmarke(folie, k, x, y, gross=False):
    g = 40 if gross else 20
    box = textbox(folie, x, y, Inches(6), Inches(1), "", g, k["_f"]["tinte"])
    p = box.text_frame.paragraphs[0]
    r1 = p.add_run(); r1.text = k["kunde"].upper()
    r1.font.name = SERIF; r1.font.bold = True; r1.font.size = Pt(g)
    r1.font.color.rgb = k["_f"]["tinte"]
    r2 = p.add_run(); r2.text = " ●"
    r2.font.size = Pt(int(g * 0.55)); r2.font.color.rgb = k["_f"]["akzent"]
    return box


def kopfzeile(folie, k, titel, untertitel=None):
    balken = kachel(folie, 0, 0, BREITE, Inches(0.16), k["_f"]["akzent"])
    balken.adjustments[0] = 0.0
    textbox(folie, Inches(0.6), Inches(0.42), Inches(9.5), Inches(0.9),
            titel, 30, k["_f"]["tinte"], fett=True, font=SERIF)
    if untertitel:
        textbox(folie, Inches(0.6), Inches(1.12), Inches(11.5), Inches(0.5),
                untertitel, 14, k["_f"]["grau"])
    wortmarke(folie, k, Inches(10.6), Inches(0.45))


def bild_oder_platzhalter(folie, k, pfad, x, y, b, h, beschriftung):
    p = Path(pfad) if pfad else None
    if p and p.is_file():
        bild = folie.shapes.add_picture(str(p), x, y, width=b)
        if bild.height > h:  # zu hoch -> an Hoehe ausrichten
            folie.shapes._spTree.remove(bild._element)
            bild = folie.shapes.add_picture(str(p), x, y, height=h)
            bild.left = int(x + (b - bild.width) / 2)
        return bild
    kachel(folie, x, y, b, h, k["_f"]["papier"], rand=k["_f"]["grau"])
    textbox(folie, x, y, b, h, "[ Bildschirm-Foto einsetzen:\n" + beschriftung + " ]",
            14, k["_f"]["grau"], zentriert=True, anker=MSO_ANCHOR.MIDDLE)
    return None


# ---------- Folien ----------

def slide_titel(prs, k):
    f = leere_folie(prs, k["_f"]["tinte"])
    weiss = farbe("FFFFFF")
    box = textbox(f, Inches(1.2), Inches(2.3), Inches(11), Inches(1.4), "", 54, weiss)
    p = box.text_frame.paragraphs[0]
    r1 = p.add_run(); r1.text = k["kunde"].upper()
    r1.font.name = SERIF; r1.font.bold = True; r1.font.size = Pt(54); r1.font.color.rgb = weiss
    r2 = p.add_run(); r2.text = " ●"
    r2.font.size = Pt(30); r2.font.color.rgb = k["_f"]["akzent"]
    textbox(f, Inches(1.2), Inches(3.7), Inches(10.5), Inches(1.0),
            k["claim"], 22, farbe("D8D6DC"), font=SERIF)
    textbox(f, Inches(1.2), Inches(6.3), Inches(10), Inches(0.6),
            k["untertitel_titelfolie"] + "  ·  " + k["datum"], 13, farbe("9A97A0"))


def slide_momente(prs, k):
    f = leere_folie(prs, k["_f"]["papier"])
    m = k["momente"]
    kopfzeile(f, k, m["titel"], m.get("untertitel"))
    b = Inches(3.85); abstand = Inches(0.35); x = Inches(0.6)
    for eintrag in m["punkte"]:
        kachel(f, x, Inches(1.9), b, Inches(4.3), farbe("FFFFFF"), rand=farbe("E5E3DF"))
        textbox(f, x + Inches(0.3), Inches(2.15), b - Inches(0.6), Inches(3.8), "", 14,
                k["_f"]["tinte"],
                zeilen=[(eintrag["kopf"], 15, k["_f"]["akzent"], True, SANS),
                        (eintrag["text"], 14, k["_f"]["tinte"], False, SANS),
                        (eintrag["danach"], 14, k["_f"]["tinte"], True, SANS)])
        x += b + abstand
    textbox(f, Inches(0.6), Inches(6.5), Inches(12), Inches(0.6),
            m.get("fusszeile", ""), 12, k["_f"]["grau"])


def slide_prinzipien(prs, k):
    f = leere_folie(prs, k["_f"]["papier"])
    p = k["prinzipien"]
    kopfzeile(f, k, p["titel"], p.get("untertitel"))
    y = Inches(2.0)
    for i, eintrag in enumerate(p["punkte"], 1):
        kachel(f, Inches(0.6), y, Inches(0.55), Inches(0.55), k["_f"]["akzent"])
        textbox(f, Inches(0.6), y + Inches(0.04), Inches(0.55), Inches(0.5),
                str(i), 20, farbe("FFFFFF"), fett=True, zentriert=True)
        textbox(f, Inches(1.45), y - Inches(0.06), Inches(11.2), Inches(1.3), "", 14,
                k["_f"]["tinte"],
                zeilen=[(eintrag["kopf"], 17, k["_f"]["tinte"], True, SERIF),
                        (eintrag["text"], 13.5, k["_f"]["grau"], False, SANS)])
        y += Inches(1.55)


def slide_ui(prs, k, screen):
    f = leere_folie(prs, k["_f"]["papier"])
    kopfzeile(f, k, screen["titel"], screen.get("text"))
    bild_oder_platzhalter(f, k, screen.get("pfad"), Inches(1.7), Inches(1.85),
                          Inches(9.9), Inches(5.1), screen["titel"])
    textbox(f, Inches(0.6), Inches(7.05), Inches(12), Inches(0.4),
            k.get("ui_fussnote", ""), 11, k["_f"]["grau"])


def slide_schritte(prs, k):
    f = leere_folie(prs, k["_f"]["papier"])
    s = k["schritte"]
    kopfzeile(f, k, s["titel"], s.get("untertitel"))
    n = len(s["punkte"]); b = Inches(2.85); x = Inches(0.6); y = Inches(2.1)
    for i, eintrag in enumerate(s["punkte"], 1):
        kachel(f, x, y, b, Inches(3.6), farbe("FFFFFF"), rand=farbe("E5E3DF"))
        kachel(f, x + Inches(0.25), y + Inches(0.25), Inches(0.5), Inches(0.5), k["_f"]["tinte"])
        textbox(f, x + Inches(0.25), y + Inches(0.28), Inches(0.5), Inches(0.45),
                str(i), 18, farbe("FFFFFF"), fett=True, zentriert=True)
        textbox(f, x + Inches(0.25), y + Inches(0.95), b - Inches(0.5), Inches(2.5), "", 13,
                k["_f"]["tinte"],
                zeilen=[(eintrag["kopf"], 14.5, k["_f"]["tinte"], True, SANS),
                        (eintrag["text"], 12.5, k["_f"]["grau"], False, SANS)])
        x += b + Inches(0.28)
    textbox(f, Inches(0.6), Inches(6.2), Inches(12.1), Inches(0.9),
            s.get("fusszeile", ""), 12.5, k["_f"]["tinte"], fett=True)


def slide_preise(prs, k):
    f = leere_folie(prs, k["_f"]["papier"])
    m = k["modelle"]
    kopfzeile(f, k, m["titel"], m.get("untertitel"))
    b = Inches(3.85); x = Inches(0.6); y = Inches(1.85)
    for modell in m["liste"]:
        empfohlen = modell.get("empfohlen", False)
        grund = k["_f"]["tinte"] if empfohlen else farbe("FFFFFF")
        schrift = farbe("FFFFFF") if empfohlen else k["_f"]["tinte"]
        kachel(f, x, y, b, Inches(4.7), grund,
               rand=None if empfohlen else farbe("E5E3DF"))
        zeilen = [(modell["name"], 17, k["_f"]["akzent"] if not empfohlen else farbe("F0C9C3"), True, SERIF),
                  (modell["preis"] + " " + m["preis_einheit"], 24, schrift, True, SANS)]
        if modell.get("zusatz"):
            zeilen.append((modell["zusatz"], 11.5, k["_f"]["grau"] if not empfohlen else farbe("B7B4BD"), False, SANS))
        for feat in modell["features"]:
            zeilen.append(("–  " + feat["name"], 13, schrift, False, SANS))
        textbox(f, x + Inches(0.3), y + Inches(0.3), b - Inches(0.6), Inches(4.2),
                "", 13, schrift, zeilen=zeilen)
        if empfohlen and m.get("empfehlung_etikett"):
            kachel(f, x + Inches(0.3), y - Inches(0.25), Inches(1.9), Inches(0.5), k["_f"]["akzent"])
            textbox(f, x + Inches(0.3), y - Inches(0.22), Inches(1.9), Inches(0.45),
                    m["empfehlung_etikett"], 12, farbe("FFFFFF"), fett=True, zentriert=True)
        x += b + Inches(0.35)
    textbox(f, Inches(0.6), Inches(6.75), Inches(12.1), Inches(0.6),
            m.get("fusszeile", ""), 11.5, k["_f"]["grau"])


def slide_klartext(prs, k, modell, einheit):
    f = leere_folie(prs, k["_f"]["papier"])
    kopfzeile(f, k, modell["name"] + " — was das für dich heisst",
              modell["preis"] + " " + einheit + (("  ·  " + modell["zusatz"]) if modell.get("zusatz") else ""))
    y = Inches(1.9)
    for feat in modell["features"]:
        textbox(f, Inches(0.7), y, Inches(3.6), Inches(0.8),
                feat["name"], 15, k["_f"]["akzent"], fett=True)
        textbox(f, Inches(4.5), y, Inches(8.2), Inches(0.8),
                feat["klartext"], 14, k["_f"]["tinte"])
        y += Inches(0.95)
    if modell.get("basis_hinweis"):
        textbox(f, Inches(0.7), y + Inches(0.1), Inches(11.5), Inches(0.6),
                modell["basis_hinweis"], 12.5, k["_f"]["grau"])


def slide_rollen(prs, k):
    f = leere_folie(prs, k["_f"]["papier"])
    r = k["rollen"]
    kopfzeile(f, k, r["titel"], r.get("untertitel"))
    b = Inches(3.85); x = Inches(0.6)
    for eintrag in r["punkte"]:
        kachel(f, x, Inches(2.0), b, Inches(3.6), farbe("FFFFFF"), rand=farbe("E5E3DF"))
        textbox(f, x + Inches(0.3), Inches(2.3), b - Inches(0.6), Inches(3.0), "", 14,
                k["_f"]["tinte"],
                zeilen=[(eintrag["wer"], 14, k["_f"]["akzent"], True, SANS),
                        (eintrag["text"], 14, k["_f"]["tinte"], False, SANS)])
        x += b + Inches(0.35)
    textbox(f, Inches(0.6), Inches(6.1), Inches(12.1), Inches(0.7),
            r.get("fusszeile", ""), 13, k["_f"]["tinte"], fett=True)


def slide_abschluss(prs, k):
    f = leere_folie(prs, k["_f"]["tinte"])
    a = k["abschluss"]
    weiss = farbe("FFFFFF")
    textbox(f, Inches(1.2), Inches(1.6), Inches(11), Inches(1.2),
            a["titel"], 40, weiss, fett=True, font=SERIF)
    y = Inches(3.1)
    for punkt in a["punkte"]:
        textbox(f, Inches(1.2), y, Inches(10.8), Inches(0.7),
                "–  " + punkt, 17, farbe("D8D6DC"))
        y += Inches(0.75)
    textbox(f, Inches(1.2), Inches(6.4), Inches(10.8), Inches(0.6),
            a.get("fusszeile", ""), 13, farbe("9A97A0"))


def baue_deck(konfig_pfad, ziel_pfad):
    k = lade_konfig(konfig_pfad)
    prs = Presentation()
    prs.slide_width, prs.slide_height = BREITE, HOEHE
    slide_titel(prs, k)
    slide_momente(prs, k)
    slide_prinzipien(prs, k)
    for screen in k["ui_screens"]:
        slide_ui(prs, k, screen)
    slide_schritte(prs, k)
    slide_preise(prs, k)
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
