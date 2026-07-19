---
name: safe-commit
description: Alles testen + committen. Build, Backend-curl-Beweis, Frontend-Check — dann erst commit. Neuer Endpunkt ohne curl-Beweis = kein Commit.
---

# /safe-commit — Testen und Committen (ai-firma)

Ports pro Kunde aus `C:/dev/ai-firma/kunden/UEBERSICHT.md` — nie raten.

## 1. Was hat sich geaendert?
```bash
git status --short
git branch --show-current
```
Leer → "Nichts zu committen."

**NIEMALS committen:** `.env`, `settings.local.json`, `node_modules/`,
`__pycache__/`, `.venv/`, `dist/`, grosse Binaries.
**NIE direkt auf `main`** — Feature-Branch.

## 2. Build
```bash
cd frontend; npm run build 2>&1 | tail -5
```
FEHLER → STOPP. Fixen. Nochmal.

## 3. Backend testen — HARTER STOPP bei neuen Endpoints
Backend-Port dieses Kunden (aus UEBERSICHT.md) erreichbar?
```bash
curl -sf http://localhost:{BACKEND_PORT}/docs > /dev/null && echo "Backend OK" || echo "Backend NICHT erreichbar"
```

**PFLICHT** vor jedem Commit — neue Router-Endpoints im Diff?
```bash
git diff --cached --unified=0 | grep -E '^\+.*@router\.(post|get|put|delete|patch)' || echo "KEINE neuen Endpoints"
```

**Wenn die Zeile einen neuen `@router.*` zeigt:**
1. Backend MUSS laufen. Nicht laeuft → STOPP, Backend starten.
2. JEDER neue Endpoint MUSS mit `curl` getestet werden, BEVOR committet wird.
3. Status-Code MUSS 200/201/204 sein. 404 → STOPP (nicht registriert). 500 →
   STOPP (Bug). 422 → OK (Validation), aber Body-Shape pruefen.
4. Ohne diesen Test DARF der Commit NICHT stattfinden. Kein "ich teste es
   spaeter", kein "das ist ja nur ein kleiner Endpoint", kein "sollte gehen".

**Warum so streng:** Ein "neuer Endpunkt ohne curl-Beweis" ist die klassische
404-Falle — der Build ist gruen, der Endpoint aber nicht registriert. Jeder
Nachzieh-Fix kostet ~15 Min Kontextwechsel und erodiert das Vertrauen in
`npm run build` als Waechter.

## 4. Frontend testen
Frontend-Port dieses Kunden (UEBERSICHT.md) im Browser oder Preview pruefen. Geht
kein Screenshot → SA sagen, welche Seite er pruefen soll, auf OK warten.

## 5. Committen
```bash
git add {dateien}
git commit -m "{typ}: {beschreibung}

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## 6. Ausgabe
```
Committed: {hash}
Message:   {typ}: {beschreibung}
Build:     OK
Backend:   OK / nicht betroffen  (neue Endpoints: {curl-Ergebnisse})
Frontend:  OK / nicht visuell geprueft
```
