import express from "express";
import fetch from "node-fetch";
import cors from 'cors'; // Wichtig: Für die Kommunikation mit Ihrer Webseite
import dotenv from 'dotenv'; // Für das lokale Testen (wird auf Railway ignoriert)

// Lade ggf. Umgebungsvariablen für lokale Entwicklung
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_KEY = process.env.OPENAI_KEY;

// Aktiviert CORS, damit die AustriaLiebe-Webseite den Proxy aufrufen kann
// ACHTUNG: Für eine finale Anwendung sollte 'origin' auf die genaue URL Ihrer Webseite beschränkt werden.
app.use(cors());

// Middleware, um den JSON-Inhalt der Anfragen zu verarbeiten
app.use(express.json());

// Prüfen, ob der geheime API-Schlüssel gesetzt ist
if (!OPENAI_KEY) {
  console.error("FEHLER: OPENAI_KEY ist nicht in den Umgebungsvariablen gesetzt!");
  process.exit(1);
}

// Der Haupt-Proxy-Endpunkt: POST an /openai
app.post("/openai", async (req, res) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Hinzufügen des geheimen Schlüssels als Bearer Token
        "Authorization": `Bearer ${OPENAI_KEY}`,
      },
      // Leitet den gesamten Body (inkl. messages, model, etc.) vom Frontend direkt an OpenAI weiter
      body: JSON.stringify(req.body),
    });

    // Prüft auf Fehler von OpenAI (z.B. 401 Unauthorized)
    if (!response.ok) {
        const errorBody = await response.json();
        return res.status(response.status).json({ 
            error: "OpenAI API Fehler aufgetreten", 
            details: errorBody 
        });
    }

    // Leitet die erfolgreiche Antwort von OpenAI zurück an Ihre Webseite
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Interner Proxy-Fehler:", err);
    res.status(500).json({ error: "Interner Proxy Serverfehler" });
  }
});

// Startet den Server auf dem von Railway zugewiesenen Port
app.listen(PORT, () => {
  console.log(`OpenAI Proxy läuft auf Port ${PORT}`);
  console.log(`Bereit für Anfragen unter: /openai`);
});
