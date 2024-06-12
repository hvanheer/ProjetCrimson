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
    async updateGrpLink(gameRoomID, playerID, updatedGrpLink) {
        try {
            const db = await this.connexionManager.getDbConnection();
            const query = 'UPDATE grplink SET playerPoints = ?, playerRank = ?, guessedSongs = ?, averageReactionTime = ? WHERE gameRoomID = ? AND playerID = ?';
            const params = [updatedGrpLink.playerPoints, updatedGrpLink.playerRank, updatedGrpLink.guessedSongs, updatedGrpLink.averageReactionTime, gameRoomID, playerID];
            return await db.query(this.connexionManager.connection, query, params);
        } catch (err) {
            console.error('Error updating grpLink:', err);
            throw err;
        }
    }

    async deleteGrpLink(gameRoomID, playerID) {
        try {
            const db = await this.connexionManager.getDbConnection();
            await db.query(this.connexionManager.connection, 'DELETE FROM grplink WHERE gameRoomID = ? AND playerID = ?', [gameRoomID, playerID]);
            await db.query(this.connexionManager.connection, 'UPDATE gamerooms SET numberOfPlayers = numberOfPlayers - 1 WHERE gameRoomID = ?', [gameRoomID]);

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
