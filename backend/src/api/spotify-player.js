const fs = require('fs')
const SpotifyWebApi = require("spotify-web-api-node");
const token = fs.readFileSync('token.txt', 'utf8').trim();
const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(token);

window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); }
    });

    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });

    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        // Play a track
        playTrack(device_id, 'TRACK_URI'); // Replace 'TRACK_URI' with the URI of the track you want to play
    });

    // Connect to the player
    player.connect();
};

function playTrack(device_id, track_uri) {
    fetch('https://api.spotify.com/v1/me/player/play?device_id=${device_id}', {
        method: 'PUT',
            body: JSON.stringify({ uris: [track_uri] }),
            headers: {
            'Content-Type': 'application/json',
                'Authorization': 'Bearer ${token}'
        },
    }).then(response => {
        if (response.status === 403 || response.status === 404) {
            console.error('Failed to play track:', response.statusText);
        }
    }).catch(error => {
        console.error('Error playing track:', error);
    });
}