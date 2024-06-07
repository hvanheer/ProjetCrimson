const GameRoomService = require('./GameRoomService');
const GrpLinkService = require('./GrpLinkService');
const GrsLinkService = require('./GrsLinkService');
const PlayerService = require('./PlayerService');
const SongService = require('./SongService');
const SongPlayerLinkService = require('./SongPlayerLinkService');
const GameRoomModel = require('../model/GameRoomModel');
const GrpLinkModel = require('../model/GrpLinkModel')


class GameService {
    async creationGameRoomParLePlayer(playerID){
        let gameRoomService = new GameRoomService();
        let grpLinkservice = new GrpLinkService();
        let gameRoom = new GameRoomModel();
        let newGameRoom = await gameRoomService.createGameRoom(gameRoom);
        console.log(newGameRoom);
        let grpLink = new GrpLinkModel(playerID, newGameRoom.gameRoomID, 0, 0, 0, 2.5)
        await grpLinkservice.createGrpLink(grpLink)

        //TODO : renvoit du code de la gameRoom au frontend
        let responseFrontJson = {
            codeAleatoire: newGameRoom.codeAleatoire
        };
        console.log("Code Aléatoire de la GameRoom :", responseFrontJson.codeAleatoire);
    }

    async startGame(gameRoomID, numberRoundMax){
        let gameRoomService = new GameRoomService();

        //Initialisaton

        //Update du nombre maximal de joueur dans la GameRoom et l'état devient true
        //TODO : plutot faire findGameRoomByCode quand on aura la fonction dans le service
        let gameRoom = await gameRoomService.findGameRoomById(gameRoomID);
        gameRoom.numberOfRounds = numberRoundMax;
        gameRoom.state = true;
        await gameRoomService.updateGameRoom(gameRoom);

        //Lancement de la boucle de jeu :
        while(gameRoom.currentRound <= gameRoom.numberOfRounds && gameRoom.state === true){
            //Juste pour empêcher une boucle infinie avant d'écrire des trucs
            console.log("tour 1")
            gameRoom.state = false

            //incrémenter les fonctions !

        }
    }



}
module.exports = GameService;
