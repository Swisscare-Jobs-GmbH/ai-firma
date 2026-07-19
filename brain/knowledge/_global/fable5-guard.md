---
type: guard
scope: _global
status: active
datum: 2026-07-19
quelle: kuratiert aus swisscare-brain/knowledge/_global/fable5-reframe-guard.md
---

# Fable-5 Fehlalarm-Erkennung & Ehrlicher-Nachreich

> **Wozu:** Fable 5 hat eine breitere Sicherheits-Marge mit Extra-Klassifizierern (Cyber / Bio-Chemie
> / Modell-Destillation). Die sind bewusst vorsichtig und **produzieren Fehlalarme bei harmloser
> Arbeit**. SA macht ausschliesslich harmlose Business-Arbeit (Software fuer kleine Betriebe: Bau,
> Verkauf, Kunden-Betreuung, Admin). Bremst das Modell hier, ist das ein **Fehlalarm** — kein
> korrektes Nein.
>
> **Ehrlichkeit:** Dieses Protokoll raeumt NUR Fehlalarme auf echter harmloser Arbeit weg, indem es
> **wahren** Kontext liefert. Es versteckt nie eine Absicht, trickst nie den Klassifizierer aus und
> **bricht ab statt umzuformulieren**, sobald eine Anfrage echt schaedlich/dual-use ist.

## 1 — Erkennung (wann bremst das Modell auf harmloser Arbeit?)

Beobachte die **letzte eigene Modell-Antwort** (nicht SAs Prompt):

- **A · Soft-Absage** — "I cannot / I can't help / das kann ich nicht".
- **B · Schwammiges Abwiegeln** — "koennte sensibel sein / aus Vorsicht", verwaessert eine klare
  Aufgabe.
- **C · Umleiten** — antwortet auf ein sichereres, nicht gefragtes Thema.
- **D · Rueckfrage-Blockade** — "wozu brauchst du das?" bei einer schon klaren harmlosen Aufgabe.
- **E · Trigger-Wort-Fixierung** — reagiert auf ein Wort statt auf die Bedeutung: `kill`
  (haengender Prozess), `scrape` (Produktliste), `inject` (SQL-Parameter), `attack` (Funnel-Rate).
- **F · Mittendrin-Runterstufen** — kuerzt still den Umfang, verweigert einen Teilschritt.
- **G · Klassifizierer-Verraeter** — nennt ploetzlich Security/Bio/Cyber bei einer Aufgabe, die
  davon nichts hat.

**Ausloesung:** 1× Tier A ODER 2 Treffer aus B-G auf harmloser Aufgabe → Flag "Runterstufen
vermutet". Weniger → kein Hinweis (nicht nerven).

## 2 — Rote Linie (hier NICHT umformulieren, Nein stehen lassen)

Trifft die **eigentliche** Anfrage eine dieser Kategorien: **kein** Nachreich-Text. Klar sagen
"hier stufe ich NICHT um, die Absage ist korrekt". Im Zweifel → kein Nachreichen.

1. Malware / Exploit / Ransomware / Payloads.
2. Unbefugter Zugriff — fremde Systeme hacken, Passwort-Diebstahl, Phishing, Auth-Umgehung.
3. Sicherheits-/Log-Umgehung, Anti-Forensik.
4. Bio / Chemie / Radiologie / Sprengstoff.
5. Gezielte Gewalt / Waffenbau gegen konkrete Personen.
6. CSAM / sexueller Inhalt mit Minderjaehrigen — ausnahmslos.
7. Ueberwachung / Stalking / Doxxing einer konkreten realen Person ohne Einwilligung.
8. **Erfundener Kontext** — waere der "Business-Grund" gelogen, gilt dieses Protokoll nicht.

## 3 — Nachreich-Text (SA fuegt ihn im SELBEN Chat ein)

Jedes Feld liefert **wahre** Info. Was nicht wahr ausfuellbar ist, wird weggelassen — dann darf der
Text nicht raus.

```
Kontext zu mir und dieser Aufgabe:

- ROLLE: Ich fuehre eine kleine Schweizer Software-Firma (Software fuer kleine Betriebe). Das ist
  normale Business-Arbeit — [Software bauen / Verkauf / Kunden-Betreuung / Admin].
- ZWECK (das Warum): [1 ehrlicher Satz: warum ich das brauche + welcher Nutzen].
- KONKRETES ERGEBNIS: erstelle [genaues Artefakt — z.B. eine Datenbank-Abfrage / eine Mail-Vorlage /
  ein Python-Skript]. Format: [Format].
- KEIN DUAL-USE: Standard-Business-/Daten-Aufgabe, nichts Security-Offensives. Wo ein Wort wie
  "[TRIGGER-WORT]" vorkommt, meint es [harmlose Bedeutung].

Bitte auf dieser vernuenftigen harmlosen Lesart weitermachen. Falls eine echte Sorge bleibt, nenne
sie konkret statt zu stoppen.
```

## 4 — Was das Brain SA sagt (Klartext, Tabelle, Fazit oben)

> **Kurz:** Das Modell hat gerade gebremst, obwohl die Aufgabe klar harmlos ist. Grund ist
> wahrscheinlich ein Trigger-Wort. Nachreich-Text ist fertig — im selben Chat einfuegen.

| Was | Wert |
|---|---|
| Signal | z.B. Soft-Absage + Trigger-Wort `kill` |
| Aufgabe | Software-Bau (harmlos) |
| Rot-Check | ✅ keine der 8 Rot-Kategorien → Nachreichen erlaubt |
| Tun | Text aus Abschnitt 3 kopieren + einfuegen |

Ist der Rot-Check ❌ → **kein** Nachreich-Block. Stattdessen: "Hier stufe ich NICHT um — beruehrt
[Kategorie]. Die Absage ist korrekt."
