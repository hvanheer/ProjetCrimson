const connexionManager = require('../persistence/connexionManager');

class SongDAO {
    constructor() {
        this.connexionManager = new connexionManager();
    }

    async createSong(song) {
        try {
            const db = await this.connexionManager.getDbConnection();
            return await db.query(this.connexionManager.connection, 'INSERT INTO songs(songName, songArtists, songAlbum, songReleaseDate) VALUES(?, ?, ?, ?)', [song.songName, song.songArtists, song.songAlbum, song.songReleaseDate]);
        } catch (err) {
            throw err;
        }
    }

    async findSongById(songID) {
        try {
            const db = await this.connexionManager.getDbConnection();
            const songs = await db.query(this.connexionManager.connection, 'SELECT * FROM songs WHERE songID = ?', [songID]);
            return songs[0];
        } catch (err) {
            throw err;
        }
    }

    async findAllSong() {
        try {
            const db = await this.connexionManager.getDbConnection();
            return await db.query(this.connexionManager.connection, 'SELECT * FROM songs');
        } catch (err) {
            throw err;
        }
    }

    async closeDBConnection() {
        try {
            await this.connexionManager.closeDB();
        } catch (err) {
            throw err;
        }
    }
}

module.exports = SongDAO;
