require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-3.6-flash';

app.use(cors());
app.use(express.json({ limit: '15mb' })); // images can be large as base64

if (!API_KEY) {
  console.error('\n❌ ERROR: GEMINI_API_KEY is missing.');
  console.error('Create a .env file in this folder with:');
  console.error('GEMINI_API_KEY=AIza-your-key-here\n');
  process.exit(1);
}

// ---------- Health check ----------
app.get('/', (req, res) => {
  res.send('Sehat Sathi backend is running ✅');
});

// ---------- Analyze report ----------
app.post('/api/analyze', async (req, res) => {
  try {
    const { base64, mediaType } = req.body;
    if (!base64 || !mediaType) {
      return res.status(400).json({ error: 'Missing image data.' });
    }

    const prompt = `You are a medical report explainer for Indian patients with low medical literacy.
Analyze this medical report/prescription image and respond ONLY with valid JSON (no markdown, no backticks) in this exact structure:
{
  "summary": "2-3 sentence summary in simple Hinglish (Hindi+English mix as commonly spoken), easy for a non-medical person to understand",
  "condition": "the diagnosed condition/reason for report, in simple terms",
  "medicines": [
    {"name": "medicine name with strength", "dosage": "how much and how often in simple Hinglish", "duration": "how many days", "side_effects": "common side effects in simple Hinglish, or 'Koi major side effect nahi' if none significant"}
  ],
  "advice": "1-2 sentences of general advice/follow-up in simple Hinglish"
}
If the image is not a medical report, respond with {"error": "not_medical"}.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: mediaType, data: base64 } }
            ]
          }]
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error('Gemini API error:', data.error);
      return res.status(500).json({ error: data.error.message || 'AI request failed.' });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    res.json(parsed);
  } catch (err) {
    console.error('Analyze error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- Follow-up question ----------
app.post('/api/ask', async (req, res) => {
  try {
    const { context, question } = req.body;
    if (!context || !question) {
      return res.status(400).json({ error: 'Missing context or question.' });
    }

    const prompt = `Patient's report context: ${JSON.stringify(context)}\n\nPatient's question: "${question}"\n\nAnswer in simple, warm Hinglish (Hindi+English mix), 2-3 sentences max, easy for a non-medical person. If it's a serious medical decision, gently suggest confirming with their doctor.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error('Gemini API error:', data.error);
      return res.status(500).json({ error: data.error.message || 'AI request failed.' });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ answer: text });
  } catch (err) {
    console.error('Ask error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ Sehat Sathi backend running at http://localhost:${PORT}\n`);
});
