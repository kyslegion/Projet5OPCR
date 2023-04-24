const express = require('express');
const path = require('path');
const compression = require('compression');
const app = express();
const port = 3000;

// Utilisez le middleware de compression
app.use(compression());

// Utilisez les middlewares pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
