import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { detectProblemPattern, getSocraticMentorResponse } from './src/server/geminiService';
import { storage } from './src/server/storage';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // User Profile
  app.get('/api/user', (req, res) => {
    res.json(storage.getUser());
  });

  app.post('/api/user/role', (req, res) => {
    const { role } = req.body;
    if (role !== 'USER' && role !== 'ADMIN') {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const updated = storage.updateUserRole(role);
    res.json(updated);
  });

  // Patterns API
  app.get('/api/patterns', (req, res) => {
    res.json(storage.getPatterns());
  });

  app.get('/api/patterns/:id', (req, res) => {
    const pattern = storage.getPatternById(req.params.id);
    if (!pattern) return res.status(404).json({ error: 'Pattern not found' });
    res.json(pattern);
  });

  app.post('/api/patterns', (req, res) => {
    try {
      const newPattern = storage.addPattern(req.body);
      res.status(201).json(newPattern);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/patterns/:id', (req, res) => {
    const updated = storage.updatePattern(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Pattern not found' });
    res.json(updated);
  });

  app.delete('/api/patterns/:id', (req, res) => {
    const success = storage.deletePattern(req.params.id);
    if (!success) return res.status(404).json({ error: 'Pattern not found' });
    res.json({ success: true });
  });

  // Problems API
  app.get('/api/problems', (req, res) => {
    res.json(storage.getProblems());
  });

  app.get('/api/problems/:id', (req, res) => {
    const prob = storage.getProblemById(req.params.id);
    if (!prob) return res.status(404).json({ error: 'Problem not found' });
    res.json(prob);
  });

  app.post('/api/problems', (req, res) => {
    try {
      const newProb = storage.addProblem(req.body);
      res.status(201).json(newProb);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/problems/:id', (req, res) => {
    const updated = storage.updateProblem(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Problem not found' });
    res.json(updated);
  });

  app.delete('/api/problems/:id', (req, res) => {
    const success = storage.deleteProblem(req.params.id);
    if (!success) return res.status(404).json({ error: 'Problem not found' });
    res.json({ success: true });
  });

  // Spaced Repetition API
  app.get('/api/spaced-repetition', (req, res) => {
    res.json(storage.getSpacedItems());
  });

  app.post('/api/spaced-repetition/review', (req, res) => {
    const { problemId, grade, timeTakenSeconds } = req.body;
    if (!problemId || typeof grade !== 'number') {
      return res.status(400).json({ error: 'problemId and grade (0-5) are required' });
    }
    const updated = storage.reviewSpacedItem(problemId, grade, timeTakenSeconds || 60);
    res.json(updated);
  });

  // Quiz API
  app.get('/api/quiz/attempts', (req, res) => {
    res.json(storage.getQuizAttempts());
  });

  app.post('/api/quiz/submit', (req, res) => {
    try {
      const attempt = storage.logQuizAttempt(req.body);
      res.status(201).json(attempt);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // AI Detector Endpoint
  app.post('/api/ai/detector', async (req, res) => {
    try {
      const { problemStatement, problemTitle } = req.body;
      if (!problemStatement || problemStatement.trim().length === 0) {
        return res.status(400).json({ error: 'problemStatement is required' });
      }
      const result = await detectProblemPattern(problemStatement, problemTitle);
      res.json(result);
    } catch (err: any) {
      console.error('AI Detector Error:', err);
      res.status(500).json({ error: err.message || 'AI pattern detection failed.' });
    }
  });

  // AI Mentor Endpoint
  app.post('/api/ai/mentor', async (req, res) => {
    try {
      const { problemTitle, problemStatement, patternName, history, hintLevel } = req.body;
      if (!problemStatement || !patternName) {
        return res.status(400).json({ error: 'problemStatement and patternName are required' });
      }
      const mentorAdvice = await getSocraticMentorResponse(
        problemTitle || 'DSA Problem',
        problemStatement,
        patternName,
        history || [],
        hintLevel || 1
      );
      res.json({ mentorAdvice });
    } catch (err: any) {
      console.error('AI Mentor Error:', err);
      res.status(500).json({ error: err.message || 'AI Mentor failed.' });
    }
  });

  // Admin Audit Logs & Bulk Import
  app.get('/api/admin/audit-logs', (req, res) => {
    res.json(storage.getAuditLogs());
  });

  app.post('/api/admin/bulk-import', (req, res) => {
    try {
      const result = storage.bulkImport(req.body);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Vite middleware / Production build static setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
