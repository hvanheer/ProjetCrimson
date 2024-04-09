const fs = require('fs')
const SpotifyWebApi = require('spotify-web-api-node');
const token = fs.readFileSync('token.txt', 'utf8').trim();
const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(token);

//GET MY PROFILE DATA
function getUserName1() {
    (async () => {
        const me = await spotifyApi.getMe();
        console.log(me.body.display_name);
        return String(me.body.display_name);
    })().catch(e => {
        console.error(e);
    });
}
async function getUserName() {
    try {
        const me = await spotifyApi.getMe();
        console.log(me.body.display_name);
        return String(me.body.display_name);
    } catch (error) {
        console.error("Error fetching user's name:", error);
        throw error; // Re-throwing the error so it can be caught by the caller
    }
}



// Function to get the user's top 25 tracks (long term) approx. 1 year
async function getMyTopTracks() {
    try {
        const topTracks = await spotifyApi.getMyTopTracks({ limit: 25, time_range: 'long_term' });
        const tracksText = topTracks.body.items.map((track, index) => `${index + 1}. ${track.name} - ${track.artists.map(artist => artist.name).join(', ')}`).join('\n');
        fs.writeFileSync('top_tracks.txt', tracksText);

        //let index = 1; NEEDS MODIFYING
        // Extract necessary information from each track
        const tracksData = topTracks.body.items.map(track => ({
            //position: track.index, NEEDS MODIFYING
            name: track.name,
            artists: track.artists.map(artist => artist.name),
            album: track.album.name,
            release_date: track.album.release_date
        }));

        // Write the tracks data to a JSON file
        fs.writeFileSync('top_tracks.json', JSON.stringify(tracksData, null, 2))

        console.log("Your top 25 tracks of all time:");
        let songList = [];
        topTracks.body.items.forEach((track, index) => {
            console.log(`${index + 1}. ${track.name} - ${track.artists.map(artist => artist.name).join(', ')}`);
            let song = `${index + 1}. ${track.name} - ${track.artists.map(artist => artist.name).join(', ')}`;
            songList.push(song);
        });

        return tracksData;
    } catch (error) {
        console.error("Error fetching top tracks:", error);
    }
}

async function getUserData() {
    try {
        // Call both functions concurrently using Promise.all()
        const [userName, topTracks] = await Promise.all([getUserName(), getMyTopTracks()]);

        // Return an object containing both username and top tracks data
        return {
            userName: userName,
            topTracks: topTracks
        };
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}


// Export des fonctions
module.exports = { getUserName, getMyTopTracks, getUserData };

// Call the function to get the user's top tracks
//getMyTopTracks();