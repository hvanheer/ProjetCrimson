const grpLinkDAO = require('../dao/GrpLinkDAO');
const GameRoomService = require('./GameRoomService')
const PlayerService = require('./PlayerService')
class GrpLinkService {
    constructor() {
        this.grpLinkDAO = new grpLinkDAO();
        this.gameRoomService = new GameRoomService();
        this.playerService = new PlayerService();
    }

    async createGrpLink(grpLink) {
        try {
            let gameRoom = await this.gameRoomService.findGameRoomById(grpLink.game_room_id);
            gameRoom.numberOfPlayers += 1;
            await this.gameRoomService.updateGameRoom(gameRoom);
            await this.grpLinkDAO.createGrpLink(grpLink);

            let listDesConnexions = []
            let grpLinks = await this.findGrpLinkByGameRoomId(gameRoom.gameRoomID)
            for (let i = 0; i < grpLinks.length; i++) {
                let grpLinkPlayer = grpLinks[i];
                let player = await this.playerService.findPlayerById(grpLinkPlayer.playerID);
                listDesConnexions.push({playerID: player.ID_user, playerName: player.user_name});
            }

            let jsonListeDesConnexions = JSON.stringify(listDesConnexions);
            console.log(jsonListeDesConnexions);
            //TODO: renvoyer le json au front

        } catch (err) {
            throw err;
        }
    }
    async updateGrpLink(gameRoomID, playerID, updatedGrpLink){
        try {
            return await this.grpLinkDAO.updateGrpLink(gameRoomID, playerID, updatedGrpLink);
        } catch (err) {
            throw err;
        }
    }
    async deleteGrpLink(gameRoomID, playerID){
        try {
            let gameRoom = await this.gameRoomService.findGameRoomById(gameRoomID);
            await this.grpLinkDAO.deleteGrpLink(gameRoomID, playerID);
            let listDesConnexions = []
            let grpLinks = await this.findGrpLinkByGameRoomId(gameRoom.gameRoomID)
            for (let i = 0; i < grpLinks.length; i++) {
                let grpLinkPlayer = grpLinks[i];
                let player = await this.playerService.findPlayerById(grpLinkPlayer.playerID);
                listDesConnexions.push({playerID: player.ID_user, playerName: player.user_name});
            }

            let jsonListeDesConnexions = JSON.stringify(listDesConnexions);
            console.log(jsonListeDesConnexions);
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
