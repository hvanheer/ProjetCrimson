const connexionManager = require('../persistence/connexionManager');

class GameRoomDAO {
    constructor() {
        this.connexionManager = new connexionManager();
    }

    async createGameRoom(gameRoom) {
        try {
            const db = await this.connexionManager.getDbConnection();
            const result =  await db.query(this.connexionManager.connection, 'INSERT INTO gamerooms(numberOfPlayers, state, numberOfRounds, currentRound, codeAleatoire) VALUES(?, ?, ?, ?, ?)', [gameRoom.numberOfPlayers, gameRoom.state, gameRoom.numberOfRounds, gameRoom.currentRound, gameRoom.codeAleatoire]);
            const insertedId = result.insertId;
            return await this.findGameRoomById(insertedId);
        } catch (err) {
            throw err;
        }
    }

    async updateGameRoom(newGameRoom) {
        try {
            const db = await this.connexionManager.getDbConnection();
            const query = 'UPDATE gamerooms SET numberOfPlayers = ?, state = ?, numberOfRounds = ?, currentRound = ?, codeAleatoire = ? WHERE gameRoomID = ?';
            const params = [newGameRoom.numberOfPlayers, newGameRoom.state, newGameRoom.numberOfRounds, newGameRoom.currentRound, newGameRoom.codeAleatoire, newGameRoom.gameRoomID];
            return await db.query(this.connexionManager.connection, query, params);
        } catch (err) {
            console.error('Error updating game room:', err);
            throw err;
        }
    }
    async deleteGameRoom(gameRoomID) {
        try {
            const db = await this.connexionManager.getDbConnection();
            const result = await db.query(this.connexionManager.connection, 'DELETE FROM gamerooms WHERE gameRoomID = ?', [gameRoomID]);
            return result.affectedRows > 0;
        } catch (err) {
            throw err;
        }
    }

    async findGameRoomById(gameRoomID) {
        try {
            const db = await this.connexionManager.getDbConnection();
            const gameRooms = await db.query(this.connexionManager.connection, 'SELECT * FROM gamerooms WHERE gameRoomID = ?', [gameRoomID]);
            return gameRooms[0];
        } catch (err) {
            throw err;
        }
    }
    async findGameRoomByCodeAleatoire(codeAleatoire) {
        try {
            const db = await this.connexionManager.getDbConnection();
            const gameRooms = await db.query(this.connexionManager.connection, 'SELECT * FROM gamerooms WHERE codeAleatoire = ?', [codeAleatoire]);
            return gameRooms[0];
        } catch (err) {
            throw err;
        }
    }

    async findAllGameRoom() {
        try {
            const db = await this.connexionManager.getDbConnection();
            const gameRooms = await db.query(this.connexionManager.connection, 'SELECT * FROM gamerooms');
            return gameRooms;
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

module.exports = GameRoomDAO;
