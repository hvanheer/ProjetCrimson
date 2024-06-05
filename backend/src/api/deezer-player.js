const fs = require('fs');

// Read the access token from token.txt file
const token = fs.readFileSync('token.txt', 'utf8').trim();

// Initialize the Deezer SDK
const DEEZER_APP_ID = '655031'; // Replace with your Deezer App ID

DZ.init({
    appId: DEEZER_APP_ID,
    channelUrl: 'YOUR_CHANNEL_URL' // Replace with your channel URL
});

// Error handling
DZ.Event.subscribe('player_error', error => {
    console.error('Player error:', error);
});

// Playback status updates
DZ.Event.subscribe('player_play', track => {
    console.log('Track is playing:', track);
});

DZ.Event.subscribe('player_paused', track => {
    console.log('Track is paused:', track);
});

DZ.Event.subscribe('player_position', position => {
    console.log('Current position:', position);
});

// Ready event
DZ.Event.subscribe('player_loaded', () => {
    console.log('Player is ready');
    // Play a track
    playTrack('TRACK_ID'); // Replace 'TRACK_ID' with the ID of the track you want to play
});

function playTrack(trackId) {
    DZ.player.playTracks([trackId]);
    console.log(`Playing track with ID ${trackId}`);
}

window.onDeezerSDKReady = () => {
    DZ.login(response => {
        if (response.authResponse) {
            console.log('Welcome! Fetching your information...');
            DZ.api('/user/me', user => {
                console.log('Good to see you, ' + user.name + '.');
            });

            // Connect to the player
            DZ.player.play();
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, { perms: 'basic_access,manage_library' });
};
