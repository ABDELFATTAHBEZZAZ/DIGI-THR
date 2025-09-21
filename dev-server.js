import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Serve static files from client build
app.use(express.static(path.join(__dirname, 'client/dist')));

// Simple mock API for development
app.use(express.json());

// Mock authentication
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    res.json({
      id: 1,
      username: 'admin',
      name: 'Administrateur Système',
      role: 'ADMIN',
      department: 'IT',
      isActive: true
    });
  } else if (username === 'abdelfattah' && password === 'abdelfattah ocp') {
    res.json({
      id: 2,
      username: 'abdelfattah',
      name: 'Abdelfattah',
      role: 'SUPERVISEUR',
      department: 'Supervision',
      isActive: true
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Mock users API
app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, username: 'admin', name: 'Administrateur Système', role: 'ADMIN', department: 'IT', isActive: true, createdAt: new Date().toISOString() },
    { id: 2, username: 'abdelfattah', name: 'Abdelfattah', role: 'SUPERVISEUR', department: 'Supervision', isActive: true, createdAt: new Date().toISOString() }
  ]);
});

app.post('/api/users', (req, res) => {
  res.status(201).json({ ...req.body, id: Date.now(), isActive: true, createdAt: new Date().toISOString() });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 DIGI THR DocumentAnalyzer running at http://localhost:${PORT}`);
  console.log(`📱 Admin page: http://localhost:${PORT}/admin`);
  console.log(`🔐 Login page: http://localhost:${PORT}/login`);
  console.log(`👤 Test accounts:`);
  console.log(`   - admin / admin123 (ADMIN)`);
  console.log(`   - abdelfattah / abdelfattah ocp (SUPERVISEUR)`);
});
