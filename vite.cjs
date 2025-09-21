const { createServer: createViteServer } = require('vite');
const express = require('express');
const path = require('path');

function log(message, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

async function setupVite(app, server) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  return vite;
}

function serveStatic(app) {
  // In production, serve static files from the dist directory
  const distPath = path.join(__dirname, 'client', 'dist');
  app.use(express.static(distPath, { index: false }));
  
  // Handle SPA fallback - serve index.html for any other routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

module.exports = {
  setupVite,
  serveStatic,
  log
};
