const connexionManager = require('../persistence/connexionManager');

class GrpLinkDAO {
    constructor() {
        this.connexionManager = new connexionManager();
    }

    async createGrsLink(grsLink) {
        try {
            const db = await this.connexionManager.getDbConnection();
            return await db.query(this.connexionManager.connection, 'INSERT INTO grslink(gameRoomID, songID) VALUES(?, ?)', [grsLink.game_room_id, grsLink.songs_id]);
        } catch (err) {
            throw err;
        }
    }

    async findGrsLinkByGameRoomId(gameRoomID) {
        try {
            const db = await this.connexionManager.getDbConnection();
            const grsLinks = await db.query(this.connexionManager.connection, 'SELECT * FROM grslink WHERE roomGameID = ?', [gameRoomID]);
            return grsLinks[0];
        } catch (err) {
            throw err;
        }
    }
    async findGrsLinkBySongId(songID) {
        try {
            const db = await this.connexionManager.getDbConnection();
            const grsLinks = await db.query(this.connexionManager.connection, 'SELECT * FROM grslink WHERE songID = ?', [songID]);
            return grsLinks[0];
        } catch (err) {
            throw err;
        }
    }


    async findAllGrsLinkModel() {
        try {
            const db = await this.connexionManager.getDbConnection();
            return await db.query(this.connexionManager.connection, 'SELECT * FROM grslink');
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

module.exports = GrpLinkDAO;
