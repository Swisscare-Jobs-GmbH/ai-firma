# vorflug.ps1 - Mess-Basis-Stempel VOR jeder Arbeit (ai-firma, aus SwissCare-Vorlage angepasst)
# READ-ONLY: git fetch/status, gh pr view, Port->PID->Prozess->Startzeit. Aendert NICHTS.
# ASCII only (Nicht-ASCII crasht den PS1-Parser).
# Ports pro Kunde aus kunden/UEBERSICHT.md uebergeben:
#   pwsh -File vorflug.ps1 -Pfad C:\dev\finelli-cockpit -Ports 8012,5173
# Default = Finelli-Block; NIE 8000/8001/3000-3002 (dort laeuft das SwissCare-CRM,
# sonst misst der Vorflug still den falschen Stack). Pro Kunde Ports aus kunden/UEBERSICHT.md.
param(
    [string]$Pfad = (Get-Location).Path,
    [int[]]$Ports = @(8012, 5173),
    [switch]$KeinFetch
)
$ErrorActionPreference = 'SilentlyContinue'
Write-Output ("== VORFLUG {0} ==" -f (Get-Date -Format 'yyyy-MM-dd HH:mm'))
Write-Output ("Ordner   : {0}" -f $Pfad)

# --- 1) Zweig @ Hash + Drift zu origin + lokale Aenderungen ---
$branch = (git -C $Pfad rev-parse --abbrev-ref HEAD 2>$null)
$hash   = (git -C $Pfad rev-parse --short HEAD 2>$null)
if (-not $branch) {
    Write-Output "Zweig    : KEIN GIT-ORDNER - Stempel unvollstaendig"
} else {
    if (-not $KeinFetch) { git -C $Pfad fetch origin $branch 2>$null | Out-Null }
    $dirty = @(git -C $Pfad status --porcelain 2>$null).Count
    $drift = "origin unbekannt"
    $lr = (git -C $Pfad rev-list --left-right --count "origin/$branch...HEAD" 2>$null)
    if ($lr) {
        $teile = $lr -split '\s+'
        $drift = ("origin +{0} / lokal +{1}" -f $teile[0], $teile[1])
    }
    Write-Output ("Zweig    : {0} @ {1} | {2} | {3} Datei(en) lokal geaendert" -f $branch, $hash, $drift, $dirty)
}

# --- 2) PR-Status fuer diesen Zweig (falls gh da ist) ---
if ($branch -and (Get-Command gh -ErrorAction SilentlyContinue)) {
    Push-Location $Pfad
    $prJson = gh pr view $branch --json number,state,isDraft,title 2>$null
    Pop-Location
    if ($prJson) {
        $pr = $prJson | ConvertFrom-Json
        $entwurf = ""
        if ($pr.isDraft) { $entwurf = " (Entwurf)" }
        Write-Output ("PR       : #{0} {1}{2} - {3}" -f $pr.number, $pr.state, $entwurf, $pr.title)
    } else {
        Write-Output "PR       : keiner fuer diesen Zweig"
    }
}

# --- 3) Ports: PID -> Ordner -> Startzeit ---
# Zombie-Check: Prozess-Startzeit AELTER als die letzte Code-Aenderung im Ordner
# = wahrscheinlich laeuft alter Code (HTTP 200 heisst nicht gesund).
$warnungen = @()
$letzteAenderung = $null
if ($branch) {
    $neueste = Get-ChildItem -Path $Pfad -Recurse -File -Include *.py,*.ts,*.tsx,*.js,*.jsx `
        -Exclude *.min.js -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -notmatch '\\(node_modules|\.git|dist|__pycache__|\.venv|venv)\\' } |
        Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($neueste) { $letzteAenderung = $neueste.LastWriteTime }
}
foreach ($p in $Ports) {
    $conn = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $conn) { Write-Output ("Port {0,-5}: frei" -f $p); continue }
    $wp = Get-CimInstance Win32_Process -Filter ("ProcessId={0}" -f $conn.OwningProcess)
    $ordner = "? (cwd nicht aus cmdline lesbar)"
    $txt = ("{0} {1}" -f $wp.ExecutablePath, $wp.CommandLine)
    if ($txt -match '([A-Za-z]:\\dev\\[^\\\s"]+)') { $ordner = $Matches[1] }
    $start = $null
    $startTxt = "?"
    if ($wp.CreationDate) { $start = $wp.CreationDate; $startTxt = $wp.CreationDate.ToString('dd.MM. HH:mm') }
    $zeile = ("Port {0,-5}: PID {1} -> {2} | seit {3}" -f $p, $conn.OwningProcess, $ordner, $startTxt)
    if ($start -and $letzteAenderung -and ($start -lt $letzteAenderung)) {
        $zeile += " | ZOMBIE-VERDACHT (Start aelter als letzte Code-Aenderung)"
        $warnungen += ("Port {0}: Prozess seit {1}, aber Code zuletzt {2} geaendert - Server neu starten, dann urteilen" -f $p, $startTxt, $letzteAenderung.ToString('dd.MM. HH:mm'))
    }
    Write-Output $zeile
}

# --- 4) Urteil ---
if ($warnungen.Count -gt 0) {
    Write-Output ""
    foreach ($w in $warnungen) { Write-Output ("WARNUNG  : {0}" -f $w) }
    exit 1
} else {
    Write-Output "OK       : kein Stand-Konflikt auf den gemessenen Ports"
}
