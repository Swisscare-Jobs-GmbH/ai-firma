---
domain: brain
type: aufgaben-audit
owner: shared
status: done
date: 2026-07-19
user: sa
session_tag: finelli-logistik-v1-haertung
verdict: gelb
gelb_typ: leicht
hard_audit: true
outside_lens_count_rot: 0
live_db_check_status: gruen
externer_review_status: gelb
---

# HARD-AUDIT 2026-07-19 — Finelli Logistik-V1 (Anti-Fail vor Mittwoch)

> Voll-Audit: [2026-07-19-sa-finelli-logistik-v1.md](2026-07-19-sa-finelli-logistik-v1.md)
> Auftrag SA: "audite mit den Fehlern die wir beim CRM hatten (letzte 2 Wochen, Brain unter der Lupe) — wir duerfen nicht failen."

## Kern-Fund des Hard-Audits (waere sonst liegen geblieben)

**Daten-Drift in der Dev-DB — CRM-Muster "messen auf falschem Stand" WIEDERHOLT und im Audit gefangen:**
1. Mock-ID-Fix von 18.07 nacht war NUR halbe Wurzel: IDs datumsfest, Verkaufs-FORMELN noch am Tages-Abstand → derselbe Kalendertag haette morgen anderen Inhalt gehabt → idempotenter Import haette gemischt/doppelt gezaehlt.
2. Live-Beleg: 310 Verkaufs-Zeilen mit Alt-IDs in data/cockpit.db → naechster Abruf haette ~doppelt gezaehlt (Demo-Zahlen falsch, direkt vor Kunden-Besuch!).
3. Fix: Formeln (Menge/Kanal/Groesse) komplett an toordinal des Kalendertags verankert + Dev-DB bereinigt + Tests datums-robust.
4. Beweis roh: Live-Journal 28 Tage = 440 = Formel-Erwartung 440 (exakt), sync_ok=true, 36 Tests gruen.

## CRM-Fehlermuster-Abgleich (Session-eigene Belege; volle Schwarm-Landkarte folgt separat)

| CRM-Muster (letzte 2 Wochen) | Bei Finelli passiert? | Beleg + Umgang |
|---|---|---|
| Zombie-Backend / Port serviert alten Code | JA, selbst erzeugt + gefangen | Backend anfangs OHNE --reload gestartet; nach Code-Fix bewusst neu gestartet, jetzt Start-Rezept mit --reload |
| Messen/Urteilen auf falschem Stand | JA, gefangen im Audit | 310-Zeilen-Drift (oben) — vor der Demo entdeckt |
| Gruene Tests sind blind | TEILWEISE | Mock-Tests decken Echt-Modus nicht (unmoeglich ohne Schluessel — ehrlich markiert); Gegenmittel: Haerte-Tests, alter Code muss rot sein (Doppel-SKU-Test) |
| Subagent-fertig-Meldung luegt | NEIN | Schwarm-Funde stichprobenhaft am echten Code verifiziert vor Einbau |
| .env-/Port-Falle | NEIN | Ports 8012/5173 eingehalten, CRM nie beruehrt |
| Halber Fix als "fertig" | JA, 1x — im selben Audit korrigiert | ID-Fix ohne Formel-Fix; Lehre: Wurzel-Frage IMMER zu Ende denken |

## Offene Gelb-Punkte (keiner blockt Mittwoch, alle vor Echt-Betrieb)

1. Sperren prozess-lokal (ok fuer 1 Worker; bei Postgres/Multi-Worker: with_for_update).
2. Echt-Modus 0 Tests + Shopify-Kosten-Limit-Paginierung nur dokumentiert (shopify_client.py Docstring).
3. Dev-Secrets (JWT-default, PIN 0000) — VOR Kunden-Betrieb ersetzen.
4. Kein Logging-/Backup-Konzept fuer SQLite.
5. Barcode ohne echten Scanner-Test (Hardware erst Mittwoch bekannt).

## Verdict

**gelb-leicht** — Substanz stark (0 ROT in 10 Ebenen, Wurzeln sauber, Beweise roh), 3 leichte Substanz-Hinweise (Pflicht-Quellen PLAN.md/Brain-Inbox nicht gelesen; Fix-Umfang leicht ueber SA-Antwort "A"; Entscheid-Stau 1x). Anti-Fail-Ziel erfuellt: 2 App-Killer + 1 Demo-Zahlen-Verfaelschung eliminiert BEVOR Khawar sie sieht.
