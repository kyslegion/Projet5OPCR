const express = require('express');
const path = require('path');
const compression = require('compression');
const app = express();
const port = 3000;

// Utilisez le middleware de compression
app.use(compression());
const ONE_MONTH_IN_SECONDS = 30 * 24 * 60 * 60;

//enregistrement des images dans le cache
app.use('/assets/images', express.static(path.join(__dirname, './assets/images'), {
  maxAge: ONE_MONTH_IN_SECONDS * 1000,
  setHeaders: function (res, path, stat) {
    res.set('Cache-Control', 'public, must-revalidate');
    const expirationDate = new Date(Date.now() + ONE_MONTH_IN_SECONDS * 1000);
    res.set('Expires', expirationDate.toUTCString());
  }
}));

// Utilisez les middlewares pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
