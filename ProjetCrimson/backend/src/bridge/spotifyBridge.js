const express = require('express');
const connectAPI = require('../api/apiLogin')
const app = express();

// Port d'écoute du serveur
const port = 3000;
const hostname = '192.168.1.5';


// Démarrage du serveur
app.listen(port, hostname, () => {
    console.log("Serveur démarré sur http://192.168.1.5:3000");
});

// Endpoint qui répond à une requête GET
app.get('/connectAPI', (req, res) => {
    connectAPI();
    res.send('http://192.168.1.5:9999/login');
});
