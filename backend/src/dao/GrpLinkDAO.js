const connexionManager = require('../persistence/connexionManager');

class GrpLinkDAO {
    constructor() {
        this.connexionManager = new connexionManager();
    }

    async createGrpLink(grpLink) {
        try {
            const db = await this.connexionManager.getDbConnection();
            return await db.query(this.connexionManager.connection, 'INSERT INTO grplink(gameRoomID, playerID, playerPoints, playerRank, guessedSongs, averageReactionTime) VALUES(?, ?, ?, ?, ?, ?)', [grpLink.game_room_id, grpLink.player_id, grpLink.playerPoints, grpLink.playerRank, grpLink.guessedSongs, grpLink.averageReactionTime]);
        } catch (err) {
            throw err;
        }
    }

    async findGrpLinkByGameRoomId(gameRoomID) {
        try {
            const db = await this.connexionManager.getDbConnection();
            return await db.query(this.connexionManager.connection, 'SELECT * FROM grplink WHERE gameRoomID = ?', [gameRoomID]);
        } catch (err) {
            throw err;
        }
    }
    async findGrpLinkByPlayerId(playerID) {
        try {
            const db = await this.connexionManager.getDbConnection();
            return await db.query(this.connexionManager.connection, 'SELECT * FROM grplink WHERE playerID = ?', [playerID]);
        } catch (err) {
            throw err;
        }
    }

    async findAllGrpLink() {
        try {
            const db = await this.connexionManager.getDbConnection();
            return await db.query(this.connexionManager.connection, 'SELECT * FROM grplink');
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
