var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express')
const { getUserName, getMyTopTracks, getUserData} = require('../api/apiFunctions');
const fs = require('fs')
const userModel = require('../model/userModel')
const UserService = require("../service/userService");

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
    redirectUri: 'http://192.168.1.5:9999/callback'
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
                        const createdUser = new userModel(thisUserName, thisTopTracks);
                        const userService = new UserService();

                        userService.createUser(createdUser)
                            .then(user1 => {
                                console.log("User1:",user1);

                                userService.findAllUsers()
                                    .then(allUsers => {
                                        console.log("AllUsers:", allUsers);
                                    })
                                    .catch(error => {
                                        console.error("Error:", error);
                                    });
                            })
                            .catch(error => {
                                console.error("Error:", error);
                            });
                    })
                    .catch(error => {
                        console.error("Error:", error);
                    });



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

    app.listen(9999, '192.168.1.5', () =>
        console.log(
            'HTTP Server up. Now go to http://192.168.1.5:9999/login in your browser.'
        )
    );
}

//connectAPI();

// Export de la fonction connectAPI()
module.exports = connectAPI;