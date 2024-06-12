const PlayerDAO = require('../dao/PlayerDAO');
const SongModel = require("../model/SongModel");
const SongService = require("./SongService");
const SongPlayerLinkModel = require("../model/SongPlayerLinkModel");
const SongPlayerLinkService = require("./SongPlayerLinkService");

class PlayerService {
    constructor() {
        this.playerDAO = new PlayerDAO();
    }

    async createPlayer(player) {
        let songService = new SongService();
        let songPlayerLinkService = new SongPlayerLinkService();
        try {
            let createdPlayer = await this.playerDAO.createPlayer(player);
            let listOfSongs = JSON.parse(createdPlayer.top25);
            for (let i = 0; i < listOfSongs.length; i++){
                let songfromJson = listOfSongs[i];
                let song = new SongModel("0", songfromJson.name, songfromJson.artists[0], songfromJson.album.name, songfromJson.release_date);
                let createdSong = await songService.createSong(song);
                let songPlayerLink = new SongPlayerLinkModel(createdPlayer.ID_user, createdSong.songID);
                await songPlayerLinkService.createSongPlayerLink(songPlayerLink);
            }
            return createdPlayer;
        } catch (err) {
            throw err;
        }
    }
    async deletePlayer(playerID) {
        try {
            return await this.playerDAO.deletePlayer(playerID);
        } catch (err) {
            throw err;
        }
    }

    async updatePlayer(updatedPlayer) {
        try {
            return await this.playerDAO.updatePlayer(updatedPlayer) ;
        } catch (err) {
            throw err;
        }
    }
    async findPlayerById(playerID) {
        try {
            return await this.playerDAO.findPlayerById(playerID);
        } catch (err) {
            throw err;
        }
    }

    async findAllPlayers() {
        try {
            return await this.playerDAO.findAllPlayers();
        } catch (err) {
            throw err;
        }
    }

    async closeDBConnection() {
        try {
            await this.playerDAO.closeDBConnection();
        } catch (err) {
            throw err;
        }
    }
}

module.exports = PlayerService;