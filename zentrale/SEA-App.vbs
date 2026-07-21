' Startet SEA ohne sichtbares Konsolenfenster (kein Flackern).
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
ordner = fso.GetParentFolderName(WScript.ScriptFullName)
sh.CurrentDirectory = ordner
sh.Run "cmd /c """ & ordner & "\SEA-App.cmd""", 0, False
