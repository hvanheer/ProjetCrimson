const songDAO = require('../dao/songDAO');

class SongService {
    constructor() {
        this.songDAO = new songDAO();
    }

    async createSong(song) {
        try {
            return await this.songDAO.createSong(song);
        } catch (err) {
            throw err;
        }
    }
    async updateSong(updatedSong) {
        try {
            return await this.songDAO.updateSong(updatedSong);
        } catch (err) {
            throw err;
        }
    }
    async deleteSong(songID) {
        try {
            return await this.songDAO.deleteSong(songID);
        } catch (err) {
            throw err;
        }
    }
    async findBySourceId(fromSourceID) {
        try {
            return await this.songDAO.findBySourceID(fromSourceID);
        } catch (err) {
            throw err;
        }
    }
    async findSongById(songID) {
        try {
            return await this.songDAO.findSongById(songID);
        } catch (err) {
            throw err;
        }
    }

    async findAllSongs() {
        try {
            return await this.songDAO.findAllSong();
        } catch (err) {
            throw err;
        }
    }

    async closeDBConnection() {
        try {
            await this.songDAO.closeDBConnection();
        } catch (err) {
            throw err;
        }
    }
}

module.exports = SongService;