const connexionManager = require('../persistence/connexionManager');

class PlayerDAO {
    constructor() {
        this.connexionManager = new connexionManager();
    }

    async createPlayer(player) {
        try {
            const db = await this.connexionManager.getDbConnection();
            if (await this.findPlayerByName(player.user_name) !== null) {
                await this.updatePlayer(player);
                const createdPlayer = await this.findPlayerByName(player.user_name);
                console.log("Player top 25 :", createdPlayer.top25);
                return createdPlayer[0];
            } else {
                console.log("???? :", player);
                const top25String = JSON.stringify(player.top25); // Serialize the array of objects
                const result = await db.query(this.connexionManager.connection, 'INSERT INTO players(user_name, spotify, top25, token) VALUES(?, ?, ?, ?)', [player.user_name, player.spotify, top25String, player.token]);
                const playerId = result.insertId;
                const [createdPlayer] = await db.query(this.connexionManager.connection, 'SELECT * FROM players WHERE ID_user = ?', [playerId]);
                return createdPlayer;
            }
        } catch (err) {
            throw err;
        }
    }
    async updatePlayer(updatedPlayer) {
        try {
            const db = await this.connexionManager.getDbConnection();
            const query = 'UPDATE players SET user_name = ?, spotify = ?, top25 = ?, token = ? WHERE ID_user = ?';
            const top25String = JSON.stringify(updatedPlayer.top25);
            const params = [updatedPlayer.user_name, updatedPlayer.spotify, top25String, updatedPlayer.token, updatedPlayer.ID_user];
            return await db.query(this.connexionManager.connection, query, params);
        } catch (err) {
            throw err;
        }
    }
    async deletePlayer(playerID) {
        try {
            const db = await this.connexionManager.getDbConnection();
            const result = await db.query(this.connexionManager.connection, 'DELETE FROM players WHERE ID_user = ?', [playerID]);
            return result.affectedRows > 0;
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

    async findPlayerByName(playerName) {
        try {
            const db = await this.connexionManager.getDbConnection();
            const players = await db.query(this.connexionManager.connection, 'SELECT * FROM players WHERE user_name = ?', [playerName]);
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
