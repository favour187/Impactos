import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeRisk, answerFollowupQuestion } from './services/geminiService.js';
import { inspectUrl } from './services/urlInspector.js';
import { communityStore } from './services/communityStore.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Multer memory storage for uploads
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'IMPACTOS AI Risk Detection Platform',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '' && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
    time: new Date().toISOString()
  });
});

// Core Risk Analysis Endpoint
app.post('/api/analyze', upload.single('file'), async (req, res) => {
  try {
    const { inputType, content, location, context, scenarioId } = req.body;
    let imageBase64 = req.body.imageBase64;
    let imageMimeType = req.body.imageMimeType;

    // Handle file upload if present
    if (req.file) {
      imageBase64 = req.file.buffer.toString('base64');
      imageMimeType = req.file.mimetype;
    }

    const payload = {
      inputType: inputType || 'text',
      content,
      imageBase64,
      imageMimeType,
      location,
      context,
      scenarioId
    };

    const result = await analyzeRisk(payload);
    res.json(result);
  } catch (error: any) {
    console.error('Error handling /api/analyze:', error);
    res.status(500).json({
      overallRisk: 'UNKNOWN',
      riskScore: 0,
      category: 'OTHER',
      summary: 'An error occurred while processing the analysis request.',
      warningSigns: [],
      possibleConsequences: ['Unable to complete full automated screening.'],
      recommendedActions: ['Retry submission or review input format.'],
      questionsToVerify: [],
      confidence: 0,
      limitations: ['System error occurred during inference.'],
      analyzedAt: new Date().toISOString(),
      error: error.message || 'Internal Server Error'
    });
  }
});

// Safe URL Inspector Endpoint
app.post('/api/chat-followup', async (req, res) => {
  try {
    const { userQuery, category, overallRisk, summary, warningSigns } = req.body;
    if (!userQuery) {
      return res.status(400).json({ error: 'Query is required.' });
    }
    const reply = await answerFollowupQuestion(userQuery, {
      category: category || 'OTHER',
      overallRisk: overallRisk || 'UNKNOWN',
      summary: summary || '',
      warningSigns: warningSigns || []
    });
    res.json({ reply });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to process follow-up question.' });
  }
});

app.post('/api/url-inspect', (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required.' });
    }
    const result = inspectUrl(url);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'URL inspection failed.' });
  }
});

// Community Hazard Reports Endpoints
app.get('/api/reports', (req, res) => {
  res.json(communityStore.getAllReports());
});

app.post('/api/reports', upload.single('image'), (req, res) => {
  try {
    const { title, description, category, severity, latitude, longitude, locationName, reporterName } = req.body;
    let imageUrl: string | undefined;

    if (req.file) {
      imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    const newReport = communityStore.addReport({
      title: title || 'Community Hazard Report',
      description: description || '',
      category: category || 'PUBLIC SAFETY',
      severity: severity || 'MEDIUM',
      latitude: parseFloat(latitude) || 9.0765,
      longitude: parseFloat(longitude) || 7.3986,
      locationName: locationName || 'Local Community Area',
      reporterName: reporterName || 'Anonymous Resident',
      imageUrl
    });

    res.status(201).json(newReport);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create community report.' });
  }
});

app.post('/api/reports/:id/vote', (req, res) => {
  const { id } = req.params;
  const { type } = req.body; // 'confirm' or 'disagree'
  if (type !== 'confirm' && type !== 'disagree') {
    return res.status(400).json({ error: 'Invalid vote type' });
  }
  const updated = communityStore.vote(id, type);
  if (!updated) {
    return res.status(404).json({ error: 'Report not found' });
  }
  res.json(updated);
});

// Setup Vite in Development or Static Server in Production
async function setupFrontend() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, allowedHosts: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite dev middleware attached');
  } else {
    const distPath = path.resolve(__dirname, '../dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }
}

await setupFrontend();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`IMPACTOS backend listening on http://0.0.0.0:${PORT}`);
});
