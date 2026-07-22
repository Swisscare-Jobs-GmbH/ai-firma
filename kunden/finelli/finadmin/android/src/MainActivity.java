package ch.finelli.finadmin;

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
 * Finadmin, Lagerplatz-Scanner Finelli.
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
