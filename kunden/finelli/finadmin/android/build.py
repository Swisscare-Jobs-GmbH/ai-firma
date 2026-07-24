# -*- coding: utf-8 -*-
"""Baut SEA.apk aus finadmin.html. Ohne Gradle.

   Ablauf: projekt-anlegen.py erzeugt das apk/-Projekt (Manifest, Java, Icon, Asset aus
   ../finadmin.html) -> aapt2 compile/link -> javac -> d8 -> classes.dex ins APK -> zipalign ->
   apksigner (mit sea.keystore, Alias sea).

   Danach aufspielen:  adb -s <GERAET> install -r android/SEA.apk   (-r behaelt App-Daten/EANs)

   Toolchain-Pfade sind maschinenspezifisch. Ueber Umgebungsvariablen ANDROID_SDK / JDK_HOME
   ueberschreibbar. Aktuelle Standardwerte: AB-Rechner (Windows)."""
import os
import shutil
import subprocess
import sys
import zipfile

HIER = os.path.dirname(os.path.abspath(__file__))          # .../finadmin/android
PRJ = os.path.join(HIER, "apk")
BUILD = os.path.join(PRJ, "build")
KEYSTORE = os.path.join(HIER, "sea.keystore")
KEY_PASS = "sealager"                                      # interner Signier-Key, Alias "sea"
APK = os.path.join(HIER, "SEA.apk")

SDK = os.environ.get("ANDROID_SDK", r"C:\Users\abdul\AppData\Local\Android\Sdk")
BT = os.path.join(SDK, "build-tools", "36.1.0")
JAR = os.path.join(SDK, "platforms", "android-36", "android.jar")
JDK_BIN = os.path.join(os.environ.get("JDK_HOME", r"C:\Program Files\Eclipse Adoptium\jdk-21.0.5.11-hotspot"), "bin")

aapt2 = os.path.join(BT, "aapt2.exe")
d8 = os.path.join(BT, "d8.bat")
zipalign = os.path.join(BT, "zipalign.exe")
apksigner = os.path.join(BT, "apksigner.bat")
javac = os.path.join(JDK_BIN, "javac.exe")


def lauf(cmd):
    print(">", os.path.basename(cmd[0]), "...")
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print("FEHLER bei", os.path.basename(cmd[0]))
        print(r.stdout[-2000:])
        print(r.stderr[-2000:])
        sys.exit(1)
    return r


# 1. Projekt anlegen (Manifest, Java, Icon, aktuelles finadmin.html als Asset)
lauf([sys.executable, os.path.join(HIER, "projekt-anlegen.py")])

# 2. Build-Ordner frisch
if os.path.exists(BUILD):
    shutil.rmtree(BUILD)
os.makedirs(os.path.join(BUILD, "gen"))
os.makedirs(os.path.join(BUILD, "classes"))

# 3. Ressourcen kompilieren + linken (Assets kommen mit rein)
lauf([aapt2, "compile", "--dir", os.path.join(PRJ, "res"), "-o", os.path.join(BUILD, "res.zip")])
lauf([aapt2, "link", "-o", os.path.join(BUILD, "basis.apk"), "-I", JAR,
      "--manifest", os.path.join(PRJ, "AndroidManifest.xml"), "-A", os.path.join(PRJ, "assets"),
      "--java", os.path.join(BUILD, "gen"), "--min-sdk-version", "26",
      "--target-sdk-version", "34", os.path.join(BUILD, "res.zip")])

# 4. Java kompilieren (MainActivity + generierte R.java)
javas = []
for wurzel in (os.path.join(PRJ, "src"), os.path.join(BUILD, "gen")):
    for w, _, dn in os.walk(wurzel):
        javas += [os.path.join(w, d) for d in dn if d.endswith(".java")]
lauf([javac, "--release", "17", "-encoding", "UTF-8", "-classpath", JAR,
      "-d", os.path.join(BUILD, "classes")] + javas)

# 5. DEX
classes = []
for w, _, dn in os.walk(os.path.join(BUILD, "classes")):
    classes += [os.path.join(w, d) for d in dn if d.endswith(".class")]
lauf([d8, "--min-api", "26", "--output", BUILD, "--lib", JAR] + classes)

# 6. classes.dex ins APK legen
roh_apk = os.path.join(BUILD, "roh.apk")
shutil.copy(os.path.join(BUILD, "basis.apk"), roh_apk)
with zipfile.ZipFile(roh_apk, "a", zipfile.ZIP_DEFLATED) as z:
    z.write(os.path.join(BUILD, "classes.dex"), "classes.dex")

# 7. Ausrichten + signieren
unsig = os.path.join(BUILD, "unsig.apk")
lauf([zipalign, "-f", "-p", "4", roh_apk, unsig])
if os.path.exists(APK):
    os.remove(APK)
lauf([apksigner, "sign", "--ks", KEYSTORE, "--ks-pass", "pass:" + KEY_PASS,
      "--key-pass", "pass:" + KEY_PASS, "--out", APK, unsig])

print("\nFERTIG:", APK, os.path.getsize(APK), "B")
