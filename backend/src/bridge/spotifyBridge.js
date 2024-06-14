const { playSong, pauseSong, playSongDeezer, pauseSongDeezer, getMyTopTracks } = require('../api/apiFunctions');
const {isSpotify} = require("../api/apiLogin");

const express = require('express');
const session = require('express-session');
const SpotifyWebApi = require('spotify-web-api-node');
const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

// Port d'écoute du serveur
const port = 3000;
const hostname = '54.38.241.241';

const app = express();

// Spotify API credentials
const spotifyApi = new SpotifyWebApi({
    clientId: 'a8fbbf0101ef4d06a632dfea2613e5ec',
    clientSecret: '810f530692d948c39933df1250402545',
    redirectUri: 'http://54.38.241.241:9999/callback'
});

app.use(session({
    secret: 'cookie_secret',
    resave: false,
    saveUninitialized: true,
}));

const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
];

// Démarrage du serveur
app.listen(port, hostname, () => {
    console.log("Serveur démarré sur http://54.38.241.241:3000");
});

// Endpoint qui répond à une requête GET
app.get('/connectAPI', (req, res) => {
    res.send('http://54.38.241.241:9999/login');
});

app.get('/login', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/callback', async (req, res) => {
    const error = req.query.error;
    const code = req.query.code;

    if (error) {
        console.error('Callback Error:', error);
        res.send(`Callback Error: ${error}`);
        return;
    }

    try {
        const data = await spotifyApi.authorizationCodeGrant(code);
        const access_token = data.body['access_token'];
        const refresh_token = data.body['refresh_token'];
        const expires_in = data.body['expires_in'];

        console.log("Access token:", access_token);
        req.session.access_token = access_token;
        req.session.refresh_token = refresh_token;
        req.session.expires_in = Date.now() + 86400; // Store expiration time

        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        const userData = await getUserData();
        if (!userData) {
            throw new Error("Failed to retrieve user data");
        }

        if (userData.userName === 'augustindenis') {
            fs.writeFile('./access_token.txt', access_token, (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                } else {
                    console.log('Token written to file successfully');
                }
            });
            fs.writeFile('./refresh_token.txt', refresh_token, (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                } else {
                    console.log('Token written to file successfully');
                }
            });
        }

        req.session.user = userData.userName;
        console.log("User's name:", userData.userName);
        console.log("User's TopTracks:", userData.topTracksData);

        res.send('Success! You can now close the window.');
    } catch (error) {
        res.send(`Error getting Tokens: ${error}`);
    }
});

async function getUserData() {
    try {
        const meData = await spotifyApi.getMe();
        const topTracksData = getMyTopTracks();
        const userName = meData.body.display_name;
        return { userName, topTracksData };
    } catch (error) {
        console.error('Error retrieving user data:', error);
        return null;
    }
}

// Example route that requires a valid access token
app.get('/play', async (req, res) => {
    try {
        const data = await readFileAsync('top_tracks.json');
        const topTracks = JSON.parse(data);
        const randomTrack = topTracks[Math.floor(Math.random() * topTracks.length)];
        const trackId = randomTrack.trackId;
        const positionMs = (randomTrack.duration_ms) * 0.3;
        console.log('trackId:', trackId);
        console.log('positionMs:', positionMs);
        await playSong(trackId, positionMs);
        const trackInfo = {
            trackName: randomTrack.name,
            trackArtists: randomTrack.artists,
            trackAlbumCover: randomTrack.album.coverUrl
        };
        res.json({ trackInfo });
    } catch (error) {
        console.error('Error getting user data:', error);
        res.status(500).send('Error getting user data');
    }
});

app.listen(9999, '54.38.241.241', () =>
    console.log(
        'HTTP Server up. Now go to http://54.38.241.241/login or http://54.38.241.241/deezer in your browser.'
    )
);

// Endpoint to pause the currently playing song
app.get('/pause', async (req, res) => {
    try {
        if (isSpotify) {
            // Pause the currently playing song on Spotify
            await pauseSong();
            res.send('Pausing the currently playing song on Spotify.');
        } else {
            // Pause the currently playing song on Deezer
            await pauseSongDeezer();
            res.send('Pausing the currently playing song on Deezer.');
        }
    } catch (error) {
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