const connexionManager = require('../persistence/connexionManager');

class PlayerDAO {
    constructor() {
        this.connexionManager = new connexionManager();
    }

    async createPlayer(player) {
        try {
            const db = await this.connexionManager.getDbConnection();
            const top25String = JSON.stringify(player.top25); // Serialize the array of objects
            return await db.query(this.connexionManager.connection, 'INSERT INTO players(user_name, top25) VALUES(?, ?)', [player.user_name, top25String]);
        } catch (err) {
            throw err;
        }
    }

    async findPlayerById(playerID) {
        try {
            const db = await this.connexionManager.getDbConnection();
            const players = await db.query(this.connexionManager.connection, 'SELECT * FROM players WHERE ID_user = ?', [playerID]);
            return players[0];
        } catch (err) {
            throw err;
        }
    }

    async findAllPlayers() {
        try {
            const db = await this.connexionManager.getDbConnection();
            return await db.query(this.connexionManager.connection, 'SELECT * FROM players');
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

module.exports = PlayerDAO;
