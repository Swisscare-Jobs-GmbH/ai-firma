# -*- coding: utf-8 -*-
"""Legt das Android-Projekt fuer Finadmin an. Der eigentliche Build laeuft danach
   ueber aapt2 / javac / d8 / apksigner aus dem Android SDK."""
import os
import shutil
import struct
import zlib

SP = os.path.dirname(os.path.abspath(__file__))
PRJ = os.path.join(SP, "apk")
PAKET = "ch.sea.lager"
PFAD_JAVA = os.path.join(PRJ, "src", *PAKET.split("."))

for ordner in [PRJ, PFAD_JAVA,
               os.path.join(PRJ, "assets"),
               os.path.join(PRJ, "res", "values"),
               os.path.join(PRJ, "res", "mipmap-anydpi-v26"),
               os.path.join(PRJ, "res", "drawable"),
               os.path.join(PRJ, "res", "mipmap-xxhdpi")]:
    os.makedirs(ordner, exist_ok=True)

# ---------- 1. Die Weboberflaeche als Asset ----------
roh = open(os.path.join(SP, "finadmin.html"), "r", encoding="utf-8").read()
schnitt = roh.index("</style>") + len("</style>")
seite = ('<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n'
         '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
         '<meta name="theme-color" content="#17161a">\n'
         + roh[:schnitt] + '\n</head>\n<body>\n' + roh[schnitt:] + '\n</body>\n</html>')
open(os.path.join(PRJ, "assets", "index.html"), "w", encoding="utf-8").write(seite)

pilot = os.path.join(SP, "finelli-pilot.csv")
if os.path.exists(pilot):
    shutil.copy(pilot, os.path.join(PRJ, "assets", "finelli-pilot.csv"))

# ---------- 2. Manifest ----------
manifest = '''<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="%s"
    android:versionCode="1"
    android:versionName="1.0">

    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature android:name="android.hardware.camera" android:required="false" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher"
        android:theme="@style/AppTheme"
        android:hardwareAccelerated="true"
        android:allowBackup="true"
        android:supportsRtl="false">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait"
            android:configChanges="orientation|screenSize|keyboardHidden|uiMode"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
''' % PAKET
open(os.path.join(PRJ, "AndroidManifest.xml"), "w", encoding="utf-8").write(manifest)

# ---------- 3. Ressourcen ----------
open(os.path.join(PRJ, "res", "values", "strings.xml"), "w", encoding="utf-8").write(
'''<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">SEA</string>
</resources>
''')

open(os.path.join(PRJ, "res", "values", "styles.xml"), "w", encoding="utf-8").write(
'''<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="@android:style/Theme.Material.NoActionBar">
        <item name="android:statusBarColor">#17161A</item>
        <item name="android:navigationBarColor">#17161A</item>
        <item name="android:windowBackground">#17161A</item>
    </style>
</resources>
''')

open(os.path.join(PRJ, "res", "drawable", "ic_bg.xml"), "w", encoding="utf-8").write(
'''<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">
    <solid android:color="#A8271C" />
</shape>
''')

open(os.path.join(PRJ, "res", "drawable", "ic_fg.xml"), "w", encoding="utf-8").write(
'''<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp" android:height="108dp"
    android:viewportWidth="108" android:viewportHeight="108">
    <path android:fillColor="#FFFFFF"
          android:pathData="M42,32 h28 v8 h-19 v13 h17 v8 h-17 v22 h-9 z" />
    <path android:fillColor="#FFFFFF" android:pathData="M33,30 h4 v48 h-4 z" />
    <path android:fillColor="#FFFFFF" android:pathData="M74,30 h4 v48 h-4 z" />
</vector>
''')

open(os.path.join(PRJ, "res", "mipmap-anydpi-v26", "ic_launcher.xml"), "w", encoding="utf-8").write(
'''<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_bg" />
    <foreground android:drawable="@drawable/ic_fg" />
</adaptive-icon>
''')


def png_einfarbig(pfad, groesse, farbe):
    """Minimales PNG ohne Fremdbibliothek: einfarbige Flaeche."""
    r, g, b = farbe
    reihen = b"".join(b"\x00" + bytes([r, g, b]) * groesse for _ in range(groesse))
    daten = zlib.compress(reihen, 9)

    def stueck(typ, inhalt):
        k = typ + inhalt
        return struct.pack(">I", len(inhalt)) + k + struct.pack(">I", zlib.crc32(k) & 0xffffffff)

    kopf = struct.pack(">IIBBBBB", groesse, groesse, 8, 2, 0, 0, 0)
    with open(pfad, "wb") as f:
        f.write(b"\x89PNG\r\n\x1a\n" + stueck(b"IHDR", kopf) +
                stueck(b"IDAT", daten) + stueck(b"IEND", b""))


png_einfarbig(os.path.join(PRJ, "res", "mipmap-xxhdpi", "ic_launcher.png"), 144, (168, 39, 28))

# ---------- 4. Die Activity ----------
java = '''package %s;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * SEA Lager, Standort Zuerich Lagerraum 1.
 *
 * Die Oberflaeche liegt als Asset in der App. Sie wird NICHT ueber file:// geladen,
 * sondern unter https://appassets.androidplatform.net/ ausgeliefert und dabei aus den
 * Assets bedient. Nur so gilt die Seite als sicherer Kontext, und nur dann geben
 * Kamera und localStorage ueberhaupt etwas her.
 */
public class MainActivity extends Activity {

    private static final String HOST = "appassets.androidplatform.net";
    private static final int WUNSCH_KAMERA = 1;
    private static final int WUNSCH_DATEI = 2;

    private WebView web;
    private PermissionRequest offeneAnfrage;
    private ValueCallback<Uri[]> dateiRueckruf;

    private static final Map<String, String> TYPEN = new HashMap<String, String>();
    static {
        TYPEN.put("html", "text/html");
        TYPEN.put("js", "application/javascript");
        TYPEN.put("css", "text/css");
        TYPEN.put("csv", "text/csv");
        TYPEN.put("png", "image/png");
        TYPEN.put("svg", "image/svg+xml");
        TYPEN.put("json", "application/json");
    }

    @Override
    protected void onCreate(Bundle zustand) {
        super.onCreate(zustand);

        web = new WebView(this);
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setSupportZoom(false);

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest anfrage) {
                Uri u = anfrage.getUrl();
                if (u != null && HOST.equals(u.getHost())) {
                    return ausAssets(u.getPath());
                }
                return null;
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest anfrage) {
                runOnUiThread(new Runnable() {
                    public void run() {
                        String[] arten = anfrage.getResources();
                        for (int i = 0; i < arten.length; i++) {
                            if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(arten[i])) {
                                if (hatKamera()) {
                                    anfrage.grant(new String[]{PermissionRequest.RESOURCE_VIDEO_CAPTURE});
                                } else {
                                    offeneAnfrage = anfrage;
                                    frageKamera();
                                }
                                return;
                            }
                        }
                        anfrage.deny();
                    }
                });
            }

            @Override
            public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> rueckruf,
                                             FileChooserParams p) {
                if (dateiRueckruf != null) {
                    dateiRueckruf.onReceiveValue(null);
                }
                dateiRueckruf = rueckruf;
                Intent w = new Intent(Intent.ACTION_GET_CONTENT);
                w.addCategory(Intent.CATEGORY_OPENABLE);
                w.setType("*/*");
                try {
                    startActivityForResult(Intent.createChooser(w, "Produktliste waehlen"), WUNSCH_DATEI);
                } catch (Exception e) {
                    dateiRueckruf = null;
                    return false;
                }
                return true;
            }
        });

        if (!hatKamera()) {
            frageKamera();
        }
        web.loadUrl("https://" + HOST + "/index.html");
    }

    /** Liefert eine Datei aus dem Assets-Ordner unter der https-Adresse aus. */
    private WebResourceResponse ausAssets(String pfad) {
        if (pfad == null || pfad.length() == 0 || "/".equals(pfad)) {
            pfad = "/index.html";
        }
        String name = pfad.startsWith("/") ? pfad.substring(1) : pfad;
        try {
            InputStream strom = getAssets().open(name);
            int punkt = name.lastIndexOf('.');
            String endung = punkt >= 0 ? name.substring(punkt + 1).toLowerCase() : "";
            String typ = TYPEN.containsKey(endung) ? TYPEN.get(endung) : "application/octet-stream";
            WebResourceResponse antwort = new WebResourceResponse(typ, "utf-8", strom);
            Map<String, String> kopf = new HashMap<String, String>();
            kopf.put("Cache-Control", "no-store");
            antwort.setResponseHeaders(kopf);
            return antwort;
        } catch (IOException e) {
            return new WebResourceResponse("text/plain", "utf-8", 404, "Nicht gefunden",
                    new HashMap<String, String>(), null);
        }
    }

    private boolean hatKamera() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return true;
        }
        return checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED;
    }

    private void frageKamera() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            requestPermissions(new String[]{Manifest.permission.CAMERA}, WUNSCH_KAMERA);
        }
    }

    @Override
    public void onRequestPermissionsResult(int code, String[] rechte, int[] ergebnisse) {
        super.onRequestPermissionsResult(code, rechte, ergebnisse);
        if (code == WUNSCH_KAMERA && offeneAnfrage != null) {
            boolean erlaubt = ergebnisse.length > 0 && ergebnisse[0] == PackageManager.PERMISSION_GRANTED;
            if (erlaubt) {
                offeneAnfrage.grant(new String[]{PermissionRequest.RESOURCE_VIDEO_CAPTURE});
            } else {
                offeneAnfrage.deny();
            }
            offeneAnfrage = null;
        }
    }

    @Override
    protected void onActivityResult(int wunsch, int ergebnis, Intent daten) {
        super.onActivityResult(wunsch, ergebnis, daten);
        if (wunsch == WUNSCH_DATEI) {
            if (dateiRueckruf == null) {
                return;
            }
            Uri[] treffer = null;
            if (ergebnis == RESULT_OK && daten != null && daten.getData() != null) {
                treffer = new Uri[]{daten.getData()};
            }
            dateiRueckruf.onReceiveValue(treffer);
            dateiRueckruf = null;
        }
    }

    @Override
    public void onBackPressed() {
        if (web != null && web.canGoBack()) {
            web.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
''' % PAKET
open(os.path.join(PFAD_JAVA, "MainActivity.java"), "w", encoding="utf-8").write(java)

print("Projekt angelegt: " + PRJ)
for wurzel, _, dateien in os.walk(PRJ):
    for d in dateien:
        p = os.path.join(wurzel, d)
        print("  %-56s %7d B" % (os.path.relpath(p, PRJ), os.path.getsize(p)))
