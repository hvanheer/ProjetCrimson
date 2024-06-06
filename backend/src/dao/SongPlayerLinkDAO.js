const connexionManager = require("../persistence/connexionManager");

class SongPlayerLinkDAO {

    constructor() {
        this.connexionManager = new connexionManager();
    }

    async createSongPlayerLink(songPlayerLink) {
        try {
            const db = await this.connexionManager.getDbConnection();
            return await db.query(this.connexionManager.connection, 'INSERT INTO songs_players_link(playerID, songID) VALUES(?, ?)', [songPlayerLink.player_id, songPlayerLink.songs_id]);
        } catch (err) {
            throw err;
        }
    }

    async findSongPlayerLinkByPlayerId(playerID) {
        try {
            const db = await this.connexionManager.getDbConnection();
            return await db.query(this.connexionManager.connection, 'SELECT * FROM songs_players_link WHERE playerID = ?', [playerID]);
        } catch (err) {
            throw err;
        }
    }
    async findSongPlayerLinkBySongId(songID) {
        try {
            const db = await this.connexionManager.getDbConnection();
            return await db.query(this.connexionManager.connection, 'SELECT * FROM songs_players_link WHERE songID = ?', [songID]);
        } catch (err) {
            throw err;
        }
    }


    async findAllSongPlayerLink() {
        try {
            const db = await this.connexionManager.getDbConnection();
            return await db.query(this.connexionManager.connection, 'SELECT * FROM songs_players_link');
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

module.exports = SongPlayerLinkDAO;