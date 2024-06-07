const gameRoomDAO = require('../dao/GameRoomDAO');

class GameRoomService {
    constructor() {
        this.gameRoomDAO = new gameRoomDAO();
    }

    async createGameRoom(gameRoom) {
        try {
            gameRoom.codeAleatoire = await this.generateRandomCode();
            return await this.gameRoomDAO.createGameRoom(gameRoom);
        } catch (err) {
            throw err;
        }
    }
    async updateGameRoom(newGameRoom) {
        try {
            return await this.gameRoomDAO.updateGameRoom(newGameRoom) ;
        } catch (err) {
            throw err;
        }
    }

    async findGameRoomById(gameRoomID) {
        try {
            return await this.gameRoomDAO.findGameRoomById(gameRoomID);
        } catch (err) {
            throw err;
        }
    }

    async findAllGameRoom() {
        try {
            return await this.gameRoomDAO.findAllGameRoom();
        } catch (err) {
            throw err;
        }
    }

    async closeDBConnection() {
        try {
            await this.gameRoomDAO.closeDBConnection();
        } catch (err) {
            throw err;
        }
    }

    async generateRandomCode() {
        let confirmationUnique = false;
        let gameRooms = [];
        let code = '';
        try {
            gameRooms = await this.gameRoomDAO.findAllGameRoom();
            while (confirmationUnique === false) {
                code = '';
                for (let i = 0; i < 5; i++) {
                    code += Math.floor(Math.random() * 10).toString();
                }
                confirmationUnique = !gameRooms.some(room => room.codeAleatoire === code);

            }
        } catch (err) {
            throw err;
        }

        return parseInt(code);
    }
}

module.exports = GameRoomService;
