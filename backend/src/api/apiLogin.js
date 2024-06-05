var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express')
const axios = require('axios');
const { getUserName, getMyTopTracks, getUserData} = require('../api/apiFunctions');
const fs = require('fs')
const userModel = require('../model/userModel')
const UserService = require("../service/userService");
const queryString = require("querystring");

let isLoggedIn = false;

// This file is copied from: https://github.com/thelinmichael/spotify-web-api-node/blob/master/examples/tutorial/00-get-access-token.js

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

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: 'a8fbbf0101ef4d06a632dfea2613e5ec',
    clientSecret: '810f530692d948c39933df1250402545',
    redirectUri: 'http://54.38.241.241:9999/callback'
});

const app = express();

function connectAPI() {
    app.get('/login', (req, res) => {
        res.redirect(spotifyApi.createAuthorizeURL(scopes));
    });


    app.get('/callback', (req, res) => {
        const error = req.query.error;
        const code = req.query.code;
        const state = req.query.state;

        if (error) {
            console.error('Callback Error:', error);
            res.send(`Callback Error: ${error}`);
            return;
        }

        spotifyApi
            .authorizationCodeGrant(code)
            .then(async data => {
                const access_token = data.body['access_token'];
                const refresh_token = data.body['refresh_token'];
                const expires_in = data.body['expires_in'];

                // Once you get the access token, save it to a file
                fs.writeFileSync('token.txt', access_token);

                getUserData()
                    .then(userData => {
                        // Access the username from userData
                        const thisUserName = userData.userName;
                        console.log("User's name:", thisUserName);

                        const thisTopTracks = userData.topTracks;
                        console.log("User's TopTracks:", thisTopTracks);

                        // Assuming userModel constructor takes two arguments: name and topTracks
// const createdUser = new userModel(thisUserName, thisTopTracks);
// const userService = new UserService();

// userService.createUser(createdUser)
//     .then(user1 => {
//         console.log("User1:",user1);

//         userService.findAllUsers()
//             .then(allUsers => {
//                 console.log("AllUsers:", allUsers);
//             })
//             .catch(error => {
//                 console.error("Error:", error);
//             });
//     })
//     .catch(error => {
//         console.error("Error:", error);
//     });
// })
// .catch(error => {
//     console.error("Error:", error);
                    });


                isLoggedIn = true;
                console.log("The user is logged in:", isLoggedIn);

                spotifyApi.setAccessToken(access_token);
                spotifyApi.setRefreshToken(refresh_token);

                console.log('access_token:', access_token);
                console.log('refresh_token:', refresh_token);

                console.log(
                    `Sucessfully retreived access token. Expires in ${expires_in} s.`
                );
                res.send('Success! You can now close the window.');

                setInterval(async () => {
                    const data = await spotifyApi.refreshAccessToken();
                    const access_token = data.body['access_token'];

                    console.log('The access token has been refreshed!');
                    console.log('access_token:', access_token);
                    spotifyApi.setAccessToken(access_token);
                }, expires_in / 2 * 1000);
            })
            .catch(error => {
                console.error('Error getting Tokens:', error);
                res.send(`Error getting Tokens: ${error}`);
            });
    });

    /* ================================================================================ */

    const deezerAppId = '655031';
    const deezerAppSecret = '41fbb64b12aaec0eb3cff7047403b602';
    const deezerRedirectUri = 'http://54.38.241.241/callback_deezer';
    const deezerAuthUrl = `https://connect.deezer.com/oauth/auth.php?app_id=${deezerAppId}&redirect_uri=${deezerRedirectUri}&perms=basic_access,listening_history`;

    app.get('/deezer', (req, res) => {
        res.redirect(deezerAuthUrl);
    });

    app.get('/callback_deezer', async (req, res) => {
        const code = req.query.code;
        if (code) {
            const access_token_url = `https://connect.deezer.com/oauth/access_token.php?app_id=${deezerAppId}&secret=${deezerAppSecret}&code=${code}`;
            try {
                const response = await axios.get(access_token_url);
                const parsedResponse = queryString.parse(response.data);
                const accessToken = parsedResponse.access_token;
                if (accessToken) {
                    const top_tracks_url = `https://api.deezer.com/user/me/history?access_token=${accessToken}&limit=25`; // Change limit to 25
                    try {
                        const topTracksResponse = await axios.get(top_tracks_url);
                        const topTracks = topTracksResponse.data.data;
                        if (topTracks && topTracks.length > 0) {
                            // Print top tracks to console
                            console.log("Top 25 Most Played Tracks:");
                            topTracks.forEach((track, index) => {
                                console.log(`${index + 1}. ${track.title} by ${track.artist.name}`);
                            });

                            // Save top tracks to JSON file
                            fs.writeFileSync('top_tracks.json', JSON.stringify(topTracks, null, 2));

                            // Save top tracks to TXT file
                            let txtContent = "Top 25 Most Played Tracks:\n";
                            topTracks.forEach((track, index) => {
                                txtContent += `${index + 1}. ${track.title} by ${track.artist.name}\n`;
                            });
                            fs.writeFileSync('top_tracks.txt', txtContent);

                            const username = "Unique_Username_From_Deezer";
                            // Assume you have a function to save user and top tracks data
                            // saveUserData(username, topTracks);
                            return res.send("Successfully retrieved and saved top tracks from Deezer for the user.");
                        } else {
                            return res.send("No tracks found for the user on Deezer.");
                        }
                    } catch (error) {
                        console.error("Error fetching top tracks:", error);
                        return res.status(500).send("Failed to get top tracks from Deezer.");
                    }
                } else {
                    return res.send("Failed to get access token from Deezer response.");
                }
            } catch (error) {
                console.error("Error fetching access token:", error);
                return res.status(500).send("Failed to get access token from Deezer.");
            }
        } else {
            return res.send("No code received from Deezer.");
        }
    });

    app.listen(9999, '54.38.241.241', () =>
        console.log(
            'HTTP Server up. Now go to http://54.38.241.241/login or http://54.38.241.241/deezer in your browser.'
        )
    );
}

//connectAPI();

// Export de la fonction connectAPI()
module.exports = connectAPI;