const fs = require('fs')
const SpotifyWebApi = require("spotify-web-api-node");
const fetch = require("node-fetch");
const access_token = fs.readFileSync('access_token.txt', 'utf8').trim();
const refresh_token = fs.readFileSync('refresh_token.txt', 'utf8').trim();
const spotifyApi = new SpotifyWebApi();
const fetch = require('node-fetch');
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

async function refreshToken(refresh_token) {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`a8fbbf0101ef4d06a632dfea2613e5ec:810f530692d948c39933df1250402545`).toString('base64'),
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    return data.access_token;
}

async function getActiveDevice(token) {
    const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to get devices');
    }

    const data = await response.json();
    const devices = data.devices;
    const activeDevice = devices.find(device => device.is_active);

    if (!activeDevice) {
        throw new Error('No active device found');
    }

    return activeDevice.id;
}


async function playTrack(device_id, track_uri, access_token, refresh_token) {
    try {
        let device_id;

        try {
            device_id = await getActiveDevice(access_token);
        } catch (error) {
            console.error('Error getting active device:', error);
            return;
        }

        let response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [track_uri] }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
        });

        if (response.status === 401) { // Unauthorized, likely due to an expired token
            const newToken = await refreshToken(refresh_token);
            console.log('Access token refreshed:', newToken);

            // Retry the playTrack function with the new token
            const retryResponse = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                method: 'PUT',
                body: JSON.stringify({ uris: [track_uri] }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${newToken}`
                },
            });

            if (!retryResponse.ok) {
                console.error('Failed to play track after refreshing token:', retryResponse.statusText);
            }
        } else if (!response.ok) {
            console.error('Failed to play track:', response.statusText);
        }
    } catch (error) {
        console.error('Error playing track:', error);
    }
}


/*function playTrack(device_id, track_uri) {
    fetch('https://api.spotify.com/v1/me/player/play?device_id=${device_id}', {
        method: 'PUT',
            body: JSON.stringify({ uris: [track_uri] }),
            headers: {
            'Content-Type': 'application/json',
                'Authorization': 'Bearer ${access_token}'
        },
    }).then(response => {
        if (response.status === 403 || response.status === 404) {
            console.error('Failed to play track:', response.statusText);
        }
    }).catch(error => {
        console.error('Error playing track:', error);
    });
}*/