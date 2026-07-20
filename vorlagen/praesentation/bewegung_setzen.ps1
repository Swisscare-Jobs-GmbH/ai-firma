# Setzt Folien-Uebergaenge + dezente Eingangs-Animationen per PowerPoint-COM.
# Aufruf: powershell -File bewegung_setzen.ps1 <quelle.pptx> <ziel.pptx>
# Braucht installiertes PowerPoint. Non-fatal: schlaegt eine Animation fehl, bleibt der Uebergang.
param([Parameter(Mandatory=$true)][string]$Quelle, [Parameter(Mandatory=$true)][string]$Ziel)

$ppFadeSmoothly     = 3894   # eleganter Standard-Uebergang
$msoAnimFloatUp     = 30     # Eingangs-Effekt: Aufsteigen (Float In)
$afterPrevious      = 2      # Trigger: automatisch nach dem vorigen
$withPrevious       = 3      # Trigger: gleichzeitig mit dem vorigen

$pp = New-Object -ComObject PowerPoint.Application
$pres = $pp.Presentations.Open($Quelle, $true, $false, $false)

foreach ($slide in $pres.Slides) {
  $t = $slide.SlideShowTransition
  $t.EntryEffect = $ppFadeSmoothly
  $t.Duration = 0.7
  $t.AdvanceOnClick = $true

  $idx = $slide.SlideIndex
  if ($idx -eq 1 -or $idx -eq 10) {
    $seq = $slide.TimeLine.MainSequence
    $shapes = $slide.Shapes
    for ($i = 2; $i -le $shapes.Count; $i++) {
      try {
        $shp = $shapes.Item($i)
        $trig = if ($i -eq 2) { $afterPrevious } else { $withPrevious }
        $eff = $seq.AddEffect($shp, $msoAnimFloatUp, 0, $trig)
        $eff.Timing.Duration = 0.5
        if ($i -gt 2) { $eff.Timing.TriggerDelayTime = 0.04 * ($i - 2) }
      } catch { }
    }
  }
}

$pres.SaveAs($Ziel)
$pres.Close()
$pp.Quit()
Write-Output "OK: Bewegung gesetzt -> $Ziel"
