const { playSong, pauseSong, playSongDeezer, pauseSongDeezer, getMyTopTracks } = require('../api/apiFunctions');
const {isSpotify} = require("../api/apiLogin");
const PlayerService = require("../service/PlayerService");
const PlayerModel = require("../model/PlayerModel");

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

        console.log('Successfully retrieved access token. Expires : ', req.session.expires_in, '.');

        const playerCreated = await getUserData(access_token);
        req.session.user = playerCreated.user_name;
        console.log("User's name:", playerCreated.user_name);
        console.log("User's TopTracks:", playerCreated.top25);

        res.send('Success! You can now close the window.');
    } catch (error) {
        res.send(`Error getting Tokens: ${error}`);
    }
});

// Middleware to ensure user is authenticated
const ensureAuthenticated = async (req, res, next) => {
    console.log('Access token:', req.session.access_token);
    if (!req.session.access_token) {
        res.status(401).send('User not authenticated');
        return;
    }

    if (Date.now() > req.session.expires_in) {
        try {
            spotifyApi.setAccessToken(req.session.access_token);
            spotifyApi.setRefreshToken(req.session.refresh_token);

            const data = await spotifyApi.refreshAccessToken();
            req.session.access_token = data.body['access_token'];
            req.session.expires_in = Date.now() + data.body['expires_in'] * 1000;

            spotifyApi.setAccessToken(req.session.access_token);

            console.log('Access token refreshed:', req.session.access_token);
        } catch (error) {
            console.error('Error refreshing access token:', error);
            res.status(401).send('Session expired. Please log in again.');
            return;
        }
    } else {
        spotifyApi.setAccessToken(req.session.access_token);
    }

    next();
};

async function getUserData(access_token) {
    try {
        const meData = await spotifyApi.getMe();
        const topTracksData = await spotifyApi.getMyTopTracks({ limit: 20 });
        const userName = meData.body.display_name;
        const tracksData = topTracksData.body.items.map(track => ({
            trackId: track.id,
            name: track.name,
            artists: track.artists.map(artist => artist.name),
            album: {
                name: track.album.name,
                coverUrl: track.album.images.length > 0 ? track.album.images[0].url : null // Use the first image as the cover URL
            },
            release_date: track.album.release_date,
            duration_ms: track.duration_ms
        }));
        this.playerService = new PlayerService();
        const player = new PlayerModel(userName, true, tracksData, access_token);
        return this.playerService.createPlayer(player);
    } catch (error) {
        console.error('Error retrieving user data:', error);
        return null;
    }
}

// Example route that requires a valid access token
app.get('/play', async (req, res) => {
    console.log('User name:', req.session.user);
    // try {
    //     const data = await readFileAsync('top_tracks.json');
    //     const topTracks = JSON.parse(data);
    //     const randomTrack = topTracks[Math.floor(Math.random() * topTracks.length)];
    //     const trackId = randomTrack.trackId;
    //     console.log('trackId:', trackId);
    //     const positionMs = (randomTrack.duration_ms) * 0.3;
    //     await playSong(trackId, positionMs);
    //
    //     const trackInfo = {
    //         trackName: randomTrack.name,
    //         trackArtists: randomTrack.artists,
    //         trackAlbumCover: randomTrack.album.coverUrl
    //     };
    //
    //     res.json({ trackInfo });
    // } catch (error) {
    //     console.error('Error getting user data:', error);
    //     res.status(500).send('Error getting user data');
    // }
});

app.listen(9999, '54.38.241.241', () =>
    console.log(
        'HTTP Server up. Now go to http://54.38.241.241/login or http://54.38.241.241/deezer in your browser.'
    )
);



// app.get('/callback', (req, res) => {
//     const error = req.query.error;
//     const code = req.query.code;
//     const state = req.query.state;
//
//     if (error) {
//         console.error('Callback Error:', error);
//         res.send(`Callback Error: ${error}`);
//         return;
//     }
//
//     spotifyApi.authorizationCodeGrant(code)
//         .then(async data => {
//             const access_token = data.body['access_token'];
//             const refresh_token = data.body['refresh_token'];
//             const expires_in = data.body['expires_in'];
//
//             // Save tokens in session
//             req.session.access_token = access_token;
//             req.session.refresh_token = refresh_token;
//             req.session.expires_in = expires_in;
//             req.session.isSpotify = true;
//
//             // Save access token to use it later
//             spotifyApi.setAccessToken(access_token);
//             spotifyApi.setRefreshToken(refresh_token);
//
//             console.log('access_token:', access_token);
//             console.log('refresh_token:', refresh_token);
//             console.log('Successfully retrieved access token. Expires in ${expires_in} s.');
//
//             // Fetch user data
//             return getUserData();
//         })
//         .then(userData => {
//             if (!userData) {
//                 throw new Error("Failed to retrieve user data");
//             }
//
//             // Debugging output for userData
//             console.log("Retrieved user data:", userData);
//
//             req.session.user = userData.userName;
//             console.log("User's name:", userData.userName);
//             console.log("User's TopTracks:", userData.topTracks);
//
//             res.send('Success! You can now close the window.');
//
//             // Refresh the access token before it expires
//             setInterval(async () => {
//                 try {
//                     const data = await spotifyApi.refreshAccessToken();
//                     const newAccessToken = data.body['access_token'];
//                     console.log('The access token has been refreshed!');
//                     console.log('access_token:', newAccessToken);
//                     spotifyApi.setAccessToken(newAccessToken);
//                     req.session.access_token = newAccessToken;
//                 } catch (error) {
//                     console.error('Error refreshing access token:', error);
//                 }
//             }, (req.session.expires_in / 2) * 1000);
//         })
//         .catch(error => {
//             console.error('Error getting Tokens:', error);
//             res.send('Error getting Tokens: ${error}');
//         });
// });

// // Endpoint to play songs
// app.get('/play', async (req, res) => {
//     try {
//         console.log('isSpotify:', isSpotify);
//         if (isSpotify) {
//             // Play a random track on Spotify
//             // Read the top tracks JSON file
//             const data = await readFileAsync('top_tracks.json');
//             const topTracks = JSON.parse(data);
//
//             // Select a random track from the list
//             const randomTrack = topTracks[Math.floor(Math.random() * topTracks.length)];
//
//             // Play the random track
//             const trackId = randomTrack.trackId;
//             console.log('trackId:', trackId)
//             const positionMs = (randomTrack.duration_ms) * 0.3; // 30% of the track's duration
//             await playSong(trackId, positionMs);
//
//             // Construct track information object
//             const trackInfo = {
//                 trackName: randomTrack.name,
//                 trackArtists: randomTrack.artists,
//                 trackAlbumCover: randomTrack.album.coverUrl
//             };
//
//             // Send response containing both track information and played track information
//             res.json({
//                 trackInfo: trackInfo
//             });
//
//         } else {
//             // Play a random track on Deezer
//             await playSongDeezer();
//             res.send('Playing a random song on Deezer.');
//         }
//     } catch (error) {
//         console.error('Error playing track:', error);
//         res.status(500).send('Failed to play or pause track.');
//     }
// });

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