const express = require('express');
const connectAPI = require('../api/apiLogin')
const { playSong, pauseSong } = require('../api/apiFunctions');
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

const app = express();

// Port d'écoute du serveur
const port = 3000;
const hostname = '54.38.241.241';


// Démarrage du serveur
app.listen(port, hostname, () => {
    console.log("Serveur démarré sur http://54.38.241.241:3000");
});

// Endpoint qui répond à une requête GET
app.get('/connectAPI', (req, res) => {
    connectAPI();
    res.send('http://54.38.241.241:9999/login');
});

// Endpoint to play a random track
app.get('/play', async (req, res) => {
    try {
        // Read the top tracks JSON file
        const data = await readFileAsync('top_tracks.json');
        const topTracks = JSON.parse(data);

        // Select a random track from the list
        const randomTrack = topTracks[Math.floor(Math.random() * topTracks.length)];

        // Play the random track
        const trackId = randomTrack.trackId;
        const positionMs = (randomTrack.duration_ms) * 0.4; // 40% of the track's duration
        await playSong(trackId, positionMs);

        // Construct track information object
        const trackInfo = {
            trackName: randomTrack.name,
            trackArtists: randomTrack.artists,
            trackAlbumCover: randomTrack.coverUrl
        };

        // Send response containing both track information and played track information
        res.json({
            trackInfo: trackInfo
        });

        // Pause the song after 5 seconds
        setTimeout(async () => {
            await pauseSong();
            console.log('Song paused after 5 seconds.');
        }, 5000); // 5000 milliseconds = 5 seconds
    } catch (error) {
        console.error('Error playing track:', error);
        res.status(500).send('Failed to play track.');
    }
});


// Endpoint to pause the currently playing song
app.get('/pause', async (req, res) => {
    try{
        await pauseSong();
        res.send(`Pausing track`);
    } catch (error){
        console.error('Error pausing track:', error);
        res.status(500).send('Failed to pause track.');
    }

});

// Route to fetch top tracks and return album cover URLs
app.get('/albumCovers', async (req, res) => {
    try {
        // Fetch top tracks from Spotify
        const topTracks = await getMyTopTracks();

        // Extract album cover URLs from the top tracks data
        const albumCovers = topTracks.map(track => track.album.images[0].url);

        // Send album cover URLs as JSON response
        res.json(albumCovers);
    } catch (error) {
        console.error('Error fetching top tracks:', error);
        res.status(500).json({ error: 'Failed to fetch top tracks' });
    }
});