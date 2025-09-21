const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 5173;

// Mock data
const users = [
  { id: 1, username: 'admin', password: 'admin123', name: 'Administrateur Système', role: 'ADMIN', department: 'IT', isActive: true, createdAt: new Date().toISOString() },
  { id: 2, username: 'abdelfattah', password: 'abdelfattah ocp', name: 'Abdelfattah', role: 'SUPERVISEUR', department: 'Supervision', isActive: true, createdAt: new Date().toISOString() }
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API Routes
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { username, password } = JSON.parse(body);
      
      // Find user in the users array
      const user = users.find(u => u.username === username && u.password === password);
      
      if (user && user.isActive) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          department: user.department,
          isActive: user.isActive
        }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid credentials' }));
      }
    });
    return;
  }

  if (pathname === '/api/users' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
    return;
  }

  if (pathname === '/api/users' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const userData = JSON.parse(body);
      const newUser = { 
        ...userData, 
        id: Date.now(), 
        isActive: true, 
        createdAt: new Date().toISOString() 
      };
      users.push(newUser);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    });
    return;
  }

  // Update user
  if (pathname.startsWith('/api/users/') && req.method === 'PUT') {
    const userId = parseInt(pathname.split('/')[3]);
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const updateData = JSON.parse(body);
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updateData };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users[userIndex]));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'User not found' }));
      }
    });
    return;
  }

  // Delete user
  if (pathname.startsWith('/api/users/') && req.method === 'DELETE') {
    const userId = parseInt(pathname.split('/')[3]);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User not found' }));
    }
    return;
  }

  // Serve static files
  let filePath = path.join(__dirname, 'client', 'public');
  
  if (pathname === '/' || pathname === '/login' || pathname === '/admin' || pathname === '/production' || pathname === '/maintenance' || pathname === '/security') {
    filePath = path.join(filePath, 'index.html');
  } else {
    filePath = path.join(filePath, pathname);
  }

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    // Fallback to index.html for SPA routing
    filePath = path.join(__dirname, 'client', 'public', 'index.html');
  }

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath);
    const contentType = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    }[ext] || 'text/plain';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - Page not found</h1><p>Please build the client first with: npm run build</p>');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 DIGI THR DocumentAnalyzer running at http://localhost:${PORT}`);
  console.log(`📱 Admin page: http://localhost:${PORT}/admin`);
  console.log(`🔐 Login page: http://localhost:${PORT}/login`);
  console.log(`👤 Test accounts:`);
  console.log(`   - admin / admin123 (ADMIN)`);
  console.log(`   - abdelfattah / abdelfattah ocp (SUPERVISEUR)`);
});
