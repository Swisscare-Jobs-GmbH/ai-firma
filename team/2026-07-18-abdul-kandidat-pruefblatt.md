# Abdul Bhatti — Kandidat Software-Sparte (18.07)

> Abdulmannan Bhatti, 24, BSc Informatik ZHAW (frisch 07/2026). AB SOFORT verfuegbar; ab August anderweitig 50% besetzt (dann ~50% fuer uns).
> Behauptete Staerken: Datenschutz, eigene DB, NAS, GitHub, Architektur, Hosting, lokale KI-Modelle. Prio: Datenschutz + lokal.
> Deal-Idee SA: erst Projekt-Geld (kein Fixlohn), bei Bewaehrung erster fester Mitarbeiter + Beteiligungs-Gespraech.
> Rolle: Technik-Gewissen (Datenschutz, Review, kundenfertig machen, lokale KI wo sinnvoll — passt zur Apotheken-Pipeline).
> PDFs im finelli-cockpit-Repo docs/angebot/: abdul-mitbau-blatt (fuer ihn) + abdul-pruefblatt-NUR-SA.

## Gespraechs-Tipps

- Frage vorlesen, dann still sein. Nicht helfen, nicht ergaenzen — wer gut ist, fuellt die Stille selbst.
- Pro Frage die fetten Woerter abhaken. 3-4 fallen = stark. 0-1 fallen = schwach — egal wie sicher er klingt.
- Einmal pro Antwort 'Warum?' nachbohren. Ein Guter erklaert dann tiefer, ein Blender wiederholt nur seine Antwort mit anderen Worten.
- Sobald er 'lokal' oder 'Datenschutz' sagt: nachfragen 'Was kostet das den Kunden, und wer wartet es?'. Ein Guter nennt Zahlen und Nachteile — ein Dogmatiker weicht aus.

## Die 9 Pruef-Fragen mit Muster-Antworten

### 1 [architektur] Ein neuer Kunde hat 4'000 Franken Budget und will eine simple Web-App fuer seine interne Bestell-Uebersicht. Wie entscheidest du, mit welcher Technik du die baust? Nenn mir deine Kriterien — nicht nur Namen von Werkzeugen.
- **Darauf hoeren:** Gut: Er fragt ZUERST zurueck. Wer nutzt es? Wer pflegt es spaeter? Dann nennt er Kriterien, keine Marken-Namen. Muss fallen: **Rueckfrage an den Kunden** · **Wartung** · **was koennen wir schon** · **Betriebskosten**. Bonus: bei kleinem Budget nimmt man bewaehrte, 'langweilige' Technik.
- **Rote Flagge:** Zaehlt nur Werkzeug-Namen auf ('Next.js, das ist modern') ohne ein Kriterium. Stellt keine einzige Rueckfrage. Wer die Technik waehlt, bevor er die Anforderung kennt, baut fuer sich — nicht fuer den Kunden.

### 2 [security-nas] Unser Kunde Finelli (Streetwear-Laden, 8 Leute) hat ein NAS im Keller mit RAID und sagt: 'Wir sind gesichert, uns kann nichts passieren.' Stimmt das — und wenn nein, was fehlt?
- **Darauf hoeren:** Gut: Er sagt sofort: **RAID ist kein Backup**. RAID hilft nur bei kaputter Festplatte — nicht bei Loeschen, Trojanern, Feuer. Muss fallen: **3-2-1-Regel** (3 Kopien, 2 Geraete-Arten, **1 Kopie ausser Haus**). Bonus: **Wiederherstellung testen** — ein nie getestetes Backup ist keins.
- **Rote Flagge:** Sagt 'RAID reicht' oder kennt die 3-2-1-Regel nicht — dann hatte er nie echten Betrieb. Auch verdaechtig: redet nur ueber Geraete und Speicherplatz, aber nie darueber, wie man Daten im Ernstfall ZURUECK bekommt.

### 3 [datenschutz] Wir vermitteln Pflegepersonal und speichern Lebenslaeufe mit Gesundheits-Angaben in einer Cloud-Datenbank (Supabase). Ein Kunde fragt: 'Ist das ueberhaupt erlaubt?' — Was sagst du ihm, und welche Daten sind nach Schweizer Gesetz besonders heikel?
- **Darauf hoeren:** Gut: Er nennt das SCHWEIZER Gesetz: **revDSG / neues Datenschutzgesetz** — nicht nur die EU-DSGVO. Gesundheitsdaten sind **besonders schuetzenswert**. Dafuer braucht es **ausdrueckliche Einwilligung**. Cloud ist erlaubt — aber nur mit **Vertrag mit dem Cloud-Anbieter** (Auftragsbearbeitung) und Blick auf den Server-Standort.
- **Rote Flagge:** Redet nur von 'DSGVO' und merkt nicht, dass die Schweiz ein eigenes Gesetz hat. Oder pauschal 'Cloud ist verboten' / 'Cloud ist unproblematisch' — beides ohne Bedingungen ist Blender-Sprech.

### 4 [lokale-ki] Ein Apotheker fragt dich im Kundengespraech: 'Kann die KI komplett bei uns im Haus laufen, ganz ohne Cloud?' — Erklaer mir in einfachen Worten: Was braucht man dafuer konkret (Programme, Geraete), und wo liegen die Grenzen gegenueber Claude oder ChatGPT?
- **Darauf hoeren:** Gut: Er nennt echte Namen. Programm: **Ollama** (oder llama.cpp). Modell: **Llama, Qwen oder Mistral** (mindestens eins). Geraet: Rechner mit starker **Grafikkarte**, ca. 2'000–4'000 Franken — grosse Modelle brauchen einen teuren Server. Und er ist ehrlich: **Qualitaet etwas schlechter** als Claude/ChatGPT.
- **Rote Flagge:** Kann keinen einzigen Programm- oder Modellnamen nennen ('man installiert halt eine KI') — dann hat er es nie selbst gemacht. Oder er behauptet, lokal auf einem Buero-PC sei genauso gut wie Claude/ChatGPT — stimmt 2026 nicht.

### 5 [architektur] Du faengst bei uns an — wir sind zu zweit, ich bin Nicht-Coder und nehme nur ab. Zwei Teile: Erstens, wie organisierst du unsere gemeinsame Code-Ablage (GitHub) im Alltag, damit nichts verloren geht? Zweitens: Freitag ging ein Update zum Kunden raus, Montag frueh ruft er an — nichts geht mehr. Was machst du als ALLERERSTES?
- **Darauf hoeren:** Teil 1: Er arbeitet auf eigenen Spuren (**Branch**) und bringt Aenderungen per Aenderungs-Vorschlag (**Pull Request**) rein. Die Haupt-Spur bleibt IMMER lauffaehig. Kleine Schritte statt Riesen-Pakete. Teil 2 ist der Kern: **erst zurueckrollen** (alte Version in Minuten zurueck), **dann Fehler suchen**. Nie andersrum.
- **Rote Flagge:** Faengt bei Teil 2 an, den Fehler zu SUCHEN statt zurueckzurollen — der Kunde steht derweil still. Kann nicht sagen, WIE er an die alte Version kommt. 'Ich pushe alles direkt auf main' = hat nie im Team gearbeitet.

### 6 [datenschutz] Wir nutzen die Claude-KI ueber die API — die Firma dahinter sitzt in den USA. Ein Kunde verlangt, dass seine Kundendaten 'die Schweiz nie verlassen'. Duerfen wir US-Dienste ueberhaupt einsetzen, und was raetst du dem Kunden konkret?
- **Darauf hoeren:** Kern: USA ist NICHT automatisch verboten. Er kennt das **Data Privacy Framework** (Abkommen Schweiz–USA, seit 2024). Er fragt zuerst: WELCHE Daten gehen ueberhaupt an die KI? Vorschlag: nur das Noetigste schicken, Namen entfernen — **anonymisieren**. Beim Wunsch 'nie verlassen': lokal geht — aber er nennt ehrlich **mehr Wartung** und **schlechtere Qualitaet** als Preis dafuer.
- **Rote Flagge:** Dogma in beide Richtungen: 'USA geht gar nie' (kennt das Abkommen nicht) oder 'machen doch alle so, egal'. Ebenfalls rot: 'lokal ist IMMER besser' — ohne Kosten, Wartung oder Qualitaet als Nachteil zu nennen.

### 7 [lokale-ki] Eine Apotheke (aus unserer echten Pipeline) will eine KI, die Kunden-Dossiers zusammenfasst — also Gesundheitsdaten, das Heikelste ueberhaupt. Lokal bei denen im Haus oder ueber eine Cloud-API? Fuehr mich durch deine Abwaegung — mit ungefaehren Kosten.
- **Darauf hoeren:** Gut: Er sagt zuerst: Gesundheitsdaten = **besonders schuetzenswert** — HIER ist lokal ein echtes Argument, nicht nur Geschmack. Aber er rechnet trotzdem: eigener KI-Server = mehrere tausend Franken plus laufende **Wartung**. Und er nennt mindestens einen zweiten Weg: **anonymisieren** + Cloud, Vertrag mit dem Anbieter, oder **Hybrid** (nur der heikle Schritt lokal).
- **Rote Flagge:** Sagt nur 'lokal, weil sicher' und fertig — ohne Kosten, ohne Wartung, ohne eine einzige Alternative. Wer keinen zweiten Weg nennen kann, denkt nicht in Abwaegungen, sondern hat eine Lieblingsantwort.

### 8 [security-nas] Samstag, 9 Uhr: Ein Apotheken-Kunde ruft an — auf dem Bildschirm steht eine Erpresser-Nachricht, die Kundendaten sind verschluesselt (Ransomware). Auch das NAS mit den Backups haengt im selben Netzwerk. Was sind deine ersten Schritte, in welcher Reihenfolge?
- **Darauf hoeren:** Die Reihenfolge zaehlt. (1) **Isolieren**: Netzwerk-Kabel ziehen, WLAN aus — NICHT ausschalten, nichts loeschen, kein Loesegeld. (2) Umfang klaeren. (3) Backups pruefen — er muss SELBST merken: NAS im selben Netz = wohl mit-verschluesselt, darum Kopie **ausser Haus** (3-2-1). (4) **Meldepflicht**: Vorfall dem **EDOEB** (Datenschutz-Beauftragter des Bundes) melden, betroffene Kunden informieren. (5) Erst dann: neu aufsetzen, alle Passwoerter tauschen.
- **Rote Flagge:** Sagt sofort 'neu installieren' oder 'Backup einspielen' — ohne zu isolieren und zu pruefen, ob das Backup sauber ist. Gross: die Meldepflicht faellt gar nicht. Und wer sagt 'mit lokalem Server waere das nie passiert', ist Dogmatiker — Ransomware trifft lokale Systeme genauso, oft zuerst.

### 9 [lokale-ki] Finelli, unser Streetwear-Kunde — 1 Laden, Shopify, kein eigener Informatiker, kleines Budget. Er will KI-Produkttexte und Antwort-Entwuerfe fuer Kunden-Mails, etwa 200 Anfragen im Monat, keine heiklen Daten. Du hast freie Hand: lokal oder API — und warum? (FANG-FRAGE: hier ist lokal die FALSCHE Antwort — kommt direkt nach der Apotheken-Frage, wo lokal richtig war.)
- **Darauf hoeren:** Gut: klare Ansage: **API ist hier richtig**, lokal waere falsch. Mit Zahlen: 200 Anfragen = **ein paar Franken pro Monat** ueber die API. Lokaler Server = tausende Franken plus Wartung, die beim Kunden niemand leisten kann — und die Texte waeren schlechter. Faustregel: **lokal lohnt nur bei sensiblen Daten oder viel Volumen** — hier fehlt beides.
- **Rote Flagge:** Empfiehlt trotzdem lokal ('Datenschutz ist immer wichtig', 'langfristig billiger') — genau das Dogma, das uns bei Kunden Geld und Nerven kostet. Ebenfalls schwach: eiert herum, keine klare Empfehlung ('kommt drauf an' ohne Aufloesung).
