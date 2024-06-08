const PlayerDAO = require('../dao/PlayerDAO');

class PlayerService {
    constructor() {
        this.playerDAO = new PlayerDAO();
    }

    async createPlayer(player) {
        try {
            return await this.playerDAO.createPlayer(player);
        } catch (err) {
            throw err;
        }
    }
    async deletePlayer(playerID) {
        try {
            return await this.playerDAO.deletePlayer(playerID);
        } catch (err) {
            throw err;
        }
    }
    async findPlayerById(playerID) {
        try {
            return await this.playerDAO.findPlayerById(playerID);
        } catch (err) {
            throw err;
        }
    }

    async findAllPlayers() {
        try {
            return await this.playerDAO.findAllPlayers();
        } catch (err) {
            throw err;
        }
    }

    async closeDBConnection() {
        try {
            await this.playerDAO.closeDBConnection();
        } catch (err) {
            throw err;
        }
    }
}

module.exports = PlayerService;