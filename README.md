# IMPACTOS — Real-World Risk & Danger Detection Platform

> **Tagline:** Spot the risk before it becomes a problem.
> **Core Question:** *“Could there be a danger here?”*

IMPACTOS is an AI-powered real-world danger and risk detection platform built for **NGN Hacks 2026**. Users can submit text, images, URLs, contracts, or situation descriptions, and Google Gemini AI evaluates the situation for potential hazards, scams, structural defects, contract traps, or safety warning signs.

---

## 🚀 Key Features

* **Universal Analyzer (`/analyze`)**: Multimodal risk detection for text, photos, web URLs, contracts/PDFs, and situation descriptions.
* **Google Gemini AI Integration**: Live multimodal vision and text reasoning via `@google/genai` (`gemini-2.5-flash`).
* **Risk Assessment UI**: Animated circular Risk Gauge (0–100), severity classification (`LOW`, `CAUTION`, `HIGH`, `CRITICAL`, `UNKNOWN`), warning sign breakdown, potential consequences, actionable next steps, and questions to verify.
* **Interactive AI Follow-up Assistant**: Ask direct follow-up questions to Gemini AI regarding any flagged situation.
* **12 Real-World Risk Explorer (`/explore`)**: Browse risk patterns across Digital Safety, Housing, Public Safety, Environment, Agriculture, Energy, Transport, Business, Documents, Finance, Health, and Personal Safety.
* **Crowdsourced Hazard Map (`/community`)**: Built with Leaflet & OpenStreetMap to report and view local physical hazards with community confirmation votes.
* **Personal Dashboard (`/dashboard`)**: Local activity monitor with statistics and smart pattern analysis.
* **Privacy First**: Sensitive upload handling and local browser storage.

---

## 🛠 Tech Stack

* **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide React, Leaflet & React-Leaflet
* **Backend**: Node.js, Express, TypeScript, Multer, `@google/genai`
* **Deployment**: Production build ready for Render, Railway, or Vercel

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root based on `.env.example`:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=3000
```

> **Note:** Never commit `.env` or your Google Gemini API key to GitHub.

---

## 📦 Local Development

1. **Install Dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Production Build:**
   ```bash
   npm run build
   npm start
   ```

---

## ☁️ Deployment on Render

This repository includes a pre-configured `render.yaml` blueprint.

1. **Push your code to GitHub.**
2. **Log into [Render Dashboard](https://dashboard.render.com).**
3. **Select "New Web Service" or "Blueprints".**
4. Connect your GitHub repository.
5. In the Environment Variables section on Render, set:
   * **`GEMINI_API_KEY`**: Your Google Gemini API Key
6. Click **Deploy**. Render will automatically run `npm run build` and start the server!

---

## ⚖️ Safety & Decision Support Notice

IMPACTOS is an AI-powered screening and decision-support tool. It does not provide definitive legal, medical, or structural certification. In immediate emergencies, always contact local emergency authorities directly.
