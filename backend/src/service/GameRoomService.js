const gameRoomDAO = require('../dao/GameRoomDAO');

class GameRoomService {
    constructor() {
        this.gameRoomDAO = new gameRoomDAO();
    }

    async createGameRoom(gameRoom) {
        try {
            gameRoom.codeAleatoire = this.generateRandomCode();
            return await this.gameRoomDAO.createGameRoom(gameRoom)                ;
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
        let code = '';
        try {
            let gameRooms = await this.gameRoomDAO.findAllGameRoom();
            while (confirmationUnique === false) {
                let code = '';
                for (let i = 0; i < 5; i++) {
                    code += Math.floor(Math.random() * 10);
                }
                confirmationUnique = !gameRooms.some(room => room.codeAleatoire === code);
            }
        } catch (err) {
            throw err;
        }

        return code;
    }
}

module.exports = GameRoomService;
