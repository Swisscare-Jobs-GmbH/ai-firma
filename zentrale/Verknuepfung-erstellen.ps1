# Legt eine SEA-Verknuepfung auf Desktop + im Startmenue an (mit Icon).
# Danach: Verknuepfung rechtsklicken -> "An Taskleiste anheften".
$ErrorActionPreference = "Stop"
$dir    = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ziel   = Join-Path $dir "SEA-App.vbs"
$icon   = Join-Path $dir "public\sea.ico"
$ws     = New-Object -ComObject WScript.Shell

$orte = @(
  [Environment]::GetFolderPath('Desktop'),
  (Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs')
)

foreach ($ort in $orte) {
  if (-not (Test-Path $ort)) { continue }
  $lnkPfad = Join-Path $ort 'SEA.lnk'
  $lnk = $ws.CreateShortcut($lnkPfad)
  $lnk.TargetPath       = "wscript.exe"
  $lnk.Arguments        = '"' + $ziel + '"'
  $lnk.WorkingDirectory = $dir
  $lnk.IconLocation     = $icon
  $lnk.Description       = "SEA - Software. Efficient. Automation."
  $lnk.Save()
  Write-Host "Verknuepfung erstellt: $lnkPfad"
}

Write-Host ""
Write-Host "Fertig. Zum Anheften: SEA-Verknuepfung (Desktop oder Startmenue) rechtsklicken"
Write-Host "-> 'An Taskleiste anheften'."
