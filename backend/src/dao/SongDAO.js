const connexionManager = require('../persistence/connexionManager');

class SongDAO {
    constructor() {
        this.connexionManager = new connexionManager();
    }

    async createSong(song) {
        try {
            const db = await this.connexionManager.getDbConnection();
            return await db.query(this.connexionManager.connection, 'INSERT INTO songs(fromSourceID, songName, songArtists, songAlbum, songReleaseDate) VALUES(?, ?, ?, ?, ?)', [song.fromSourceID, song.songName, song.songArtists, song.songAlbum, song.songReleaseDate]);
        } catch (err) {
            throw err;
        }
    }
    async updateSong(updatedSong) {
        try {
            const db = await this.connexionManager.getDbConnection();
            const query = 'UPDATE songs SET fromSourceID = ?, songName = ?, songArtists = ?, songAlbum = ?, songReleaseDate = ? WHERE songID = ?';
            const params = [updatedSong.fromSourceID, updatedSong.songName, updatedSong.songArtists, updatedSong.songAlbum, updatedSong.songReleaseDate, updatedSong.songID];
            return await db.query(this.connexionManager.connection, query, params);
        } catch (err) {
            console.error('Error updating song:', err);
            throw err;
        }
    }
    async deleteSong(songID) {
        try {
            const db = await this.connexionManager.getDbConnection();
            const result = await db.query(this.connexionManager.connection, 'DELETE FROM songs WHERE songID = ?', [songID]);
            return result.affectedRows > 0;
        } catch (err) {
            throw err;
        }
    }
    async findBySourceID(fromSourceID) {
        try {
            const db = await this.connexionManager.getDbConnection();
            const songs = await db.query(this.connexionManager.connection, 'SELECT * FROM songs WHERE fromSourceID = ?', [fromSourceID]);
            return songs;
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
