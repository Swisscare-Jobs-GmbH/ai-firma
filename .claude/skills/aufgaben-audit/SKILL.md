---
name: aufgaben-audit
description: Tiefen-Check der geleisteten Arbeit dieser Session (ai-firma, schlank) — prueft ob die Aufgabe gut bearbeitet wurde: Ziel verstanden, richtige Quellen genutzt, frueh gegebene Anweisungen bis zum Ende befolgt, Wurzel statt Symptom geloest. READ-ONLY (schreibt keine Lessons/Todos/Commits/Push). Triggert via /aufgaben-audit, /aufgabe-pruefen oder Phrasen "audit die aufgabe", "war meine arbeit gut", "pruef was wir gemacht haben", "wo stehen wir", "haben wir das ziel beachtet".
---

# `/aufgaben-audit` — hat der Chat die Aufgabe gut bearbeitet? (ai-firma)

Prueft die ARBEIT dieser Session, nicht den sauberen Abschluss (das macht `/chat-end-clean`).
**READ-ONLY** — nur Spiegel, schreibt nichts. Brain-Pfade: `C:/dev/ai-firma/brain/`.

## Vorab (10 Sek)
- Wer arbeitet: Default SA (global `~/.claude/CLAUDE.md`), sonst wie dort geregelt.
- Zu kurz? < 3 User-Inputs -> "Session zu kurz fuer Audit" + STOPP.
- Domain ableiten (Verkauf / Bau / Kunde / System) -> passende Brain-Quellen
  (`brain/lessons/`, `brain/firm/`, `kunden/<KUNDE>/`) mitlesen, falls relevant.

## Die 6 Check-Punkte (je 🟢 passt · 🟡 Hinweis · 🔴 Aktion noetig)

1. **Ziel** — Was war der Auftrag (erste 1-3 User-Messages)? Ein Ziel klar, oder Scope ohne Freigabe gewuchert?
2. **Quellen** — Welche Dateien gelesen, und die Pflicht-Quellen der Domain dabei (Brain/Kunden-Doku)? Gelesen aber nie genutzt = Hinweis.
3. **Instruktions-Treue ⭐ (Kern)** — Frueh gegebene Anweisungen (Format, "immer/nie X", Stil) in den LETZTEN Outputs noch befolgt? Scan ALLE User-Messages nach Befehlen/Direktiven, pruefe die letzten ~5 Outputs.
4. **Wurzel statt Symptom ⭐ (Kern)** — Echter Fix oder Umgehung? Diff auf `TODO/FIXME/HACK/--force/Mock` scannen + Chat auf "das ist nur ein Workaround".
5. **Stand** — Was laeuft / offen / blockiert (letzte Outputs)?
6. **Wie gearbeitet** — 2-3 Verhaltens-Muster gut/schlecht mit konkretem Beleg (nicht generisch).

## Verdict (feste Regel — erste zutreffende Zeile gewinnt)
- **rot:** 3+ Punkte 🔴 ODER ein Kern-Punkt (3 oder 4) 🔴 UND noch ein 🔴
- **gelb:** 1 Kern-Punkt 🔴 ODER Quellen 🔴 ODER genau 2 Punkte 🔴
- **gruen:** 0 🔴 in Ziel/Quellen/Treue/Wurzel (Stand + Wie-gearbeitet duerfen 🟡 sein)

Verboten: "gruen" wenn Instruktions-Treue oder Wurzel 🔴. **"Tests gruen" ist KEIN Beweis fuer "fertig"** — Code-committet ≠ Code-funktioniert; echter Klick/Aufruf noetig.

## Output (SA-Format: Kopf + Fazit ZUERST, dann kompakt)
```
Stufe L1 · Lead: aufgaben-audit

**Fazit:** <1-2 Zeilen: gut bearbeitet? groesster Fund?>

| Punkt | Stand |
|---|---|
| Ziel | 🟢/🟡/🔴 + 3-6 Woerter |
| Quellen | ... |
| Instruktions-Treue | ... |
| Wurzel statt Symptom | ... |
| Stand | ... |
| Wie gearbeitet | ... |

Verdict: gruen | gelb | rot — <1 Satz>
Empfehlung: <1-3 naechste Schritte, je 1 Satz>
```

## Harte Regeln
- READ-ONLY — keine Lessons/Todos/Commits. Erkenntnis -> spaeter via `/chat-end-clean`.
- Jeder Befund mit konkretem Beleg aus der Session (kein generisches Lob).
- Firma-neutral: keine CRM-Spezifika (RAV/Pipeline/Provision) — gehoeren nicht hierher.
- Format-Regeln (Kopf/Fazit/Klartext) gelten global aus `~/.claude/CLAUDE.md`.
