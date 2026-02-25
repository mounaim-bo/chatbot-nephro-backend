import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  const systemPrompt = `
  Tu es un assistant médical spécialisé en néphrologie.
  Tu réponds uniquement aux questions liées aux maladies rénales.
  Si la question est hors sujet, réponds :
  "Je suis spécialisé uniquement en néphrologie."
  Ne donne jamais de diagnostic personnalisé.
  Ne remplace jamais un médecin.
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: systemPrompt + "\n\nQuestion: " + userMessage }] }
          ]
        })
      }
    );

    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;

    res.json({ reply });

  } catch (error) {
    res.status(500).json({ reply: "Erreur serveur." });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));