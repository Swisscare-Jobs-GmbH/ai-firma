---
name: beweis-fertig
description: Pflicht-Ablauf VOR jeder "fertig"-Meldung in einem Kunden-Repo. Erzwingt Klassen-Sweep + Selbst-Klick-Beweis + Regel-Test-Check und baut den Beweis-Block fuer Rapport/PR. Triggert via /beweis-fertig oder Phrasen "ist das fertig", "melde fertig", "beweis dass es geht", "fertig-check", "definition of done" — und SOLLTE von jedem Kunden-Chat automatisch vor einer fertig-Meldung an SA gerufen werden.
---

# /beweis-fertig — kein "fertig" ohne Beweis

## Wurzel
Fehler-Klasse aus SwissCare (16.07) uebertragen: Eine Stelle gefixt, dasselbe
Problem war ueberall sonst noch da · Feature 4 Tage als "live" dokumentiert, war
es nicht · .env zeigte auf falschen Port, niemand prueste. Kern-Satz: "So
arbeiten keine Profis." → Text-Checkliste reicht nicht, nur ein echter Beweis.
Lesson-Ablage fuer neue Faelle: `C:/dev/ai-firma/brain/lessons/bau/`.

## Die 5 Pflicht-Schritte (Reihenfolge hart, keiner ueberspringbar)

### 1. KLASSEN-SWEEP
Fuer JEDE geaenderte Regel/Konstante/jedes gefixte Muster:
- grep nach dem ALTEN Wert / dem Muster ueber das ganze Kunden-Repo (backend + frontend).
- Alle Stellen fixen ODER mit Aufwand listen.
- Pflicht-Zeile: `Klasse: {N} gefunden, {M} gefixt` (N>M -> Rest begruenden).

### 2. SELBST-KLICK (im MOCK_MODE)
Den Nutzer-Weg SELBST gehen, bevor SA/der Kunde ihn sieht:
- Bevorzugt: **MOCK_MODE des Kunden-Repos** (Mock-Daten, ohne Kunden-Zugaenge
  demo-faehig) — Service-/API-Aufruf mit EXAKT den Frontend-Parametern (Werte aus
  dem Popup/Formular lesen!) + Vorher/Nachher-Messung + ROLLBACK, danach frischer
  Read: Mock-Bestand unberuehrt.
- Wo moeglich: echter Schirm-Klick auf dem Kunden-Frontend-Port (Port aus
  `kunden/UEBERSICHT.md`, Strg+Shift+R zuerst).
- Geht beides nicht: WOERTLICH "nicht am Schirm gesehen" in den Rapport —
  nie stilles Gruen.

### 3. REGEL-TEST (Haerte-Probe)
Jede SA-/Kunden-Regel bekommt einen Test, der die REGEL kodiert:
- Frage: "Wird dieser Test ROT, wenn jemand den alten Zustand zurueckbaut?"
- Alte Tests, die das Gegenteil festschreiben, werden ERSETZT (nicht angepasst)
  — mit Kommentar warum.

### 4. UMGEBUNGS-CHECK (30 Sek — die 3 Luegner)
- **Prozess frisch?** Startzeit des servierenden Prozesses NEUER als die letzte
  Datei-Aenderung (Zombie-Neulader-Falle).
- **Richtig verdrahtet?** Frontend-.env zeigt auf den Backend-Port, der in
  `kunden/UEBERSICHT.md` fuer diesen Kunden steht (nicht ein Nachbar-Port).
- **Mock-Modus aktiv?** MOCK_MODE=true, wenn der Selbst-Klick gegen Mock-Daten
  lief — sonst hast du am Kunden-Echtbestand gemessen.

### 5. BEWEIS-BLOCK bauen (geht 1:1 in Rapport an SA + PR-Text)
```
BEWEIS-FERTIG ({KUNDE})
| Schritt | Ergebnis |
|---|---|
| Klasse | {N} gefunden, {M} gefixt ({grep-Muster}) |
| Selbst-Klick | {Weg in 1 Zeile} -> {Messwert vorher/nachher} · Rollback: Mock unberuehrt {ja/nein} · Schirm: {gesehen / "nicht am Schirm gesehen"} |
| Regel-Test | {test_name} — rot bei altem Code: {ja/begruendet nein} |
| Umgebung | Prozess frisch {ja} · .env->{port} {ok} · MOCK_MODE {an/aus} |
| Rest ehrlich | {bewusste Luecken mit Ort, oder "keine"} |
```

## Verbote
- "Tests gruen" allein als Fertig-Beweis (gruene Tests koennen blind sein).
- "muesste gehen" / "sollte jetzt klappen" — nur Messwerte.
- Fertig-Meldung ohne Beweis-Block an SA.
- Einen Schritt still ueberspringen — jeder Skip steht benannt im Block.

## Abgrenzung
- /vorflug stempelt die UMGEBUNG (Zweig@Hash, Port->PID->Ordner) VOR der Arbeit.
- /beweis-fertig prueft EIN Arbeitspaket VOR der Fertig-Meldung (aktiv, klein,
  5-15 Min). Erst /beweis-fertig pro Paket, am Ende /chat-end-clean.
