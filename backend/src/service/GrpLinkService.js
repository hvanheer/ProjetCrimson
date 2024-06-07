const grpLinkDAO = require('../dao/GrpLinkDAO');
const GameRoomService = require('./GameRoomService')

class GrpLinkService {
    constructor() {
        this.grpLinkDAO = new grpLinkDAO();
        this.gameRoomService = new GameRoomService();
    }

    async createGrpLink(grpLink) {
        try {
            let gameRoom = await this.gameRoomService.findGameRoomById(grpLink.game_room_id);
            gameRoom.numberOfPlayers += 1;
            await this.gameRoomService.updateGameRoom(gameRoom);
            return await this.grpLinkDAO.createGrpLink(grpLink);
        } catch (err) {
            throw err;
        }
    }

    async findGrpLinkByGameRoomId(gameRoomID) {
        try {
            return await this.grpLinkDAO.findGrpLinkByGameRoomId(gameRoomID);
        } catch (err) {
            throw err;
        }
    }
    async findGrpLinkByPlayerId(playerID) {
        try {
            return await this.grpLinkDAO.findGrpLinkByPlayerId(playerID);
        } catch (err) {
            throw err;
        }
    }

    async findAllGrpLink() {
        try {
            return await this.grpLinkDAO.findAllGrpLink();
        } catch (err) {
            throw err;
        }
    }

    async closeDBConnection() {
        try {
            await this.grpLinkDAO.closeDBConnection();
        } catch (err) {
            throw err;
        }
    }
}

module.exports = GrpLinkService;
