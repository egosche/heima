# Installation

Das Heimaprojekt soll mithilfe dieser Installation auf Ihrem Computer nutzbar
gemacht werden. Das Frontend und Backend erhalten zusammen einen eigenen
Container.
Zusaetzlich laeuft eine MySQL-Datenbank in einem zweiten Container.

> 1 Build Docker Images

        Navigieren Sie in den Ordner 'Heima' und führen Sie hier folgenden
        Befehl aus:
            docker build -t heima-image .
        Wechseln Sie anschliessend zurueck in Ausgangsordner und navigieren Sie
        in den Ordner 'HeimaDB' und führend Sie den Befehl
            docker build -t heimadb-image .
        aus. Die beiden Heima-Images sollten nun erstellt sein und unter dem
        Befehl
            docker images
        sichtbar sein.

> 2 Build Docker Container

        Falls Sie sich nun nicht mehr im 'HeimaDB' Ordner befinden, wechseln Sie
         zu diesen zureuck und erstellen sie die zwei Container mit dem Befehl
            docker-compose up

> 3 Run Container

        Nachdem die Container mit dem compose-Befehl erstellt wurden, starten
        diese automatisch. Ueber das Docker Dashboard lassen sich die Container
        ebenfalls
        ausfuehren. Das Frontend laeuft auf Port 3000 und das Backend auf Port
        30001. Dementsprechend koennen beide ueber einen Webbrowser unter der
        jeweiligen
        Adresse aufgerufen werden (z.B. localhost:3000). Der MySQL Server laeuft
        auf Port 3307.

# Hinweise

Das Heimaprojekt, welches hierbei durch Docker erstellt wird, stimmt beinahe
vollstaendig mit dem ueberein, welches in unserem Git-Repo veroeffentlicht
wurde. Die einzige
Ausnahme bildet eine Codierungsfunktion im Backend, welche durch Docker
aufgetretene Darstellungsfehler korrigiert (s. Troubleshooting; Abs. UTF8
CODIERUNGSFEHLER)

Um Heima schneller bzw. effektiver erkunden zu koennen, wurden bereits Testdaten
auf das System geladen. Unter anderem stehen Ihnen zwei Benutzerkonten zur
Verfuegung:

    VERMIETER
    E-Mail: volkibau@gmx.com
    PW:     Chemnitz1

    BENUTZER (Mieter)
    E-Mail: vilive@gmail.com
    PW:     Chemnitz1

Natuerlich koennen auch neue Benutzerkonten ueber die Registrierung angelegt
werden.

# Troubleshooting

PORTS  
Um moegliche Kollisionen zu verhindern, wurde bei der Datenbank bereits der
entsprechende Port auf 3307 statt standardmaessig 3306 gelegt. Eventuell
muessen dennoch Ports geaendert werden. Dies kann manuell in der
docker-compose.yml (im HeimaDB Ordner) geschehen.

BACKEND VERBINDUNGSFEHLER  
Sollten Inhalte wie Zimmerinformationen oder Benutzerdaten nicht geladen
werden, ist sehr wahrscheinlich das Backend nicht korrekt gestartet. In
seltenen Faellen
kommt es vor, dass der Docker Container fuer das Frontend und Backend vor
dem Container fuer die Datenbank gestartet ist. Dadurch kann das Backend
keine Datenbankverbindung
herstellen und schaltet sich nach einigen Versuchen ab. Um diesen Fehler zu
beheben, muss lediglich der Container fuer Frontend und Backend neugestartet
werden.

UTF8 CODIERUNGSFEHLER  
Nachdem das Heimaprojekt in Docker uebertragen wurde, fiel auf, dass die
deutschen Umlaute nicht korrekt dargestellt werden. Auch nach intensiver
Suche konnte der
extakte Uebeltaeter nicht ausfindig gemacht werden. Als eine Art Workaround
wurde eine Funktion im Backend implementiert, welche die falsch kodierten
Zeichen korrigiert.
Dennoch koennte es in Ausnahmefaellen noch zu Darstellungsfehlern kommen.
Wir bitten dies zu entschuldigen.
