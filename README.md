# Sehat Sathi — Setup Guide

## Ek baar setup (5 minute)

1. **API key lo:** https://console.anthropic.com → API Keys → Create Key

2. **`.env` file banao** is folder mein (`.env.example` ko copy karke rename karo `.env`):
   ```
   ANTHROPIC_API_KEY=sk-ant-yahan-apni-key-paste-karo
   PORT=3001
   ```

3. **Dependencies install karo:**
   ```
   npm install
   ```

## Har baar chalane ke liye (2 terminal chahiye)

**Terminal 1 — Backend start karo:**
```
npm start
```
Ye dikhna chahiye: `✅ Sehat Sathi backend running at http://localhost:3001`

**Terminal 2 — Frontend kholo:**
- VS Code mein `frontend.html` pe right-click → "Open with Live Server"
- Ya seedha `frontend.html` ko double-click karke browser mein kholo

⚠️ **Important:** Backend (Terminal 1) hamesha chalta rehna chahiye jab tak app use kar rahe ho. Agar band kar diya, "Explain My Report" kaam nahi karega.

## Agar mic chahiye

Mic sirf HTTPS ya localhost pe kaam karta hai. Isliye:
- `frontend.html` ko VS Code Live Server se hi kholo (wo localhost use karta hai) — **file ko direct double-click mat karo**
- Ya Netlify pe deploy karo (tab backend bhi wahin deploy karna hoga — demo ke liye VS Code Live Server hi sabse aasan hai)

## Demo ke time

- Agar internet slow ho ya API fail ho jaye, "Try a sample" buttons use karo — wo bina internet ke bhi kaam karte hain (built-in demo data)
