const GameRoomService = require('./GameRoomService');
const GrpLinkService = require('./GrpLinkService');
const GrsLinkService = require('./GrsLinkService');
const PlayerService = require('./PlayerService');
const SongService = require('./SongService');
const SongPlayerLinkService = require('./SongPlayerLinkService');
const GameRoomModel = require('../model/GameRoomModel');
const GrpLinkModel = require('../model/GrpLinkModel')
// const {playSong} = require("../api/apiFunctions");
const SongModel = require("../model/SongModel");


async function delay(numberOfMs) {
    return new Promise(resolve => setTimeout(resolve, numberOfMs));
}

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

    async startGame(gameRoomCode, numberRoundMax){
        let gameRoomService = new GameRoomService();
        let songPlayerLinkService = new SongPlayerLinkService();

        //Initialisaton

        //Update du nombre maximal de joueur dans la GameRoom et l'état devient true
        //TODO : plutot faire findGameRoomByCode quand on aura la fonction dans le service
        let gameRoom = await gameRoomService.findGameRoomByCodeAleatoire(gameRoomCode);
        gameRoom.numberOfRounds = numberRoundMax;
        gameRoom.state = true;
        await gameRoomService.updateGameRoom(gameRoom);
        //Lancement de la boucle de jeu :
        while(gameRoom.currentRound <= gameRoom.numberOfRounds && gameRoom.state === true){
            //Juste pour empêcher une boucle infinie avant d'écrire des trucs
            console.log("tour ", gameRoom.currentRound)

            //incrémenter les fonctions !

            // Recherche aléatoire de la musique - Amélie

            // Vérification du fait que la musique a déjà été jouée - Amélie

            // La musique joue - bridge spotify - Eléa

            // TODO : Enlever plus tard
            let song = new SongModel(12, "Bob Song", "Bob", "boboy", new Date(2025, 2,2));
            // fin de à enlever plus tard
            // await playSong(song.fromSourceID, 10);
            console.log("Début de la musique")
            await delay(2000);
            console.log("Fin de la musique")

            // Attente des réponses du front pour les vote - Elea
            //TODO : Lier à l'endpoint qui renvoie la donnée. Peut être que la requete vienne du front et on fait juste un await ?

            let listOfVotes = this.reponseFrontVote();

            // Check si le vote est bon - Elea

            // Ici, le bon vote est pour la musique 3 appartient à joueur 7
            // TODO : enlever quand on aura implémenter la recherche aléatoire de musique
            let songID = 3;
            //Fin enlever

            let songPlayerLinkList = await songPlayerLinkService.findSongPlayerLinkBySongId(songID)
            let listOfResults = []
            for (let i = 0; i < listOfVotes.length; i++) {
                let vote = listOfVotes[i];
                let isVoteJuste = songPlayerLinkList.some(link => link.playerID === vote.voteId);

                if (isVoteJuste) {
                    listOfResults.push({playerId: vote.playerId, result: 1})
                    this.updateGrpLinkWinner(gameRoom.gameRoomID, vote.playerId);
                }
                else {
                    listOfResults.push({playerId: vote.playerId, result: 0})
                }
            }


            //Convertir la liste de données en format json - Eléa
            let jsonListOfResults = JSON.stringify(listOfResults);
            console.log(jsonListOfResults);
            //TODO : envoyer ce résultat au front


            // Update du compteur de tour de la GameRoom - Eléa
            gameRoom.currentRound +=1;
            gameRoomService.updateGameRoom(gameRoom);


        }
    }

    reponseFrontVote(){
        return [
            {playerId: 6, voteId: 7},
            {playerId: 7, voteId: 7},
            {playerId: 8, voteId: 6}
        ]
    }

    async updateGrpLinkWinner(gameRoomId, playerID) {
        const grpLinkService = new GrpLinkService();
        let grpLinkList = await grpLinkService.findGrpLinkByPlayerId(playerID);
        let grpLink = grpLinkList.find(link => link.gameRoomID === gameRoomId);
        grpLink.playerPoints += 10
        await grpLinkService.updateGrpLink(gameRoomId, playerID, grpLink)
    }

}
module.exports = GameService;
