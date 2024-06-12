const SongPlayerLinkDAO = require('../dao/SongPlayerLinkDAO');

class SongPlayerLinkService {
    constructor() {
        this.songPlayerLinkDAO = new SongPlayerLinkDAO();
    }

    async createSongPlayerLink(songPlayerLink) {
        try {
            return await this.songPlayerLinkDAO.createSongPlayerLink(songPlayerLink);
        } catch (err) {
            throw err;
        }
    }
    async deleteSongPlayerLink(playerID, songID) {
        try {
            return await this.songPlayerLinkDAO.deleteSongPlayerLink(playerID, songID);
        } catch (err) {
            throw err;
        }
    }
    async findSongPlayerLinkByPlayerId(playerID) {
        try {
            return await this.songPlayerLinkDAO.findSongPlayerLinkByPlayerId(playerID);
        } catch (err) {
            throw err;
        }
    }
    async findSongPlayerLinkBySongId(songID) {
        try {
            return await this.songPlayerLinkDAO.findSongPlayerLinkBySongId(songID);
        } catch (err) {
            throw err;
        }
    }

    async findAllSongPlayerLink() {
        try {
            return await this.songPlayerLinkDAO.findAllSongPlayerLink();
        } catch (err) {
            throw err;
        }
    }

    async closeDBConnection() {
        try {
            await this.songPlayerLinkDAO.closeDBConnection();
        } catch (err) {
            throw err;
        }
    }
}

module.exports = SongPlayerLinkService;
