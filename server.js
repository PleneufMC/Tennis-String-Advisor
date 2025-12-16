const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Simple static file server + SPA
const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, 'public', filePath);
  
  const ext = path.extname(filePath);
  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // Serve index.html for SPA routes
      fs.readFile(path.join(__dirname, 'public', 'index.html'), (err2, indexContent) => {
        if (err2) {
          res.writeHead(500);
          res.end('Error');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(indexContent);
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
