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
const {create} = require("axios");
const GrsLinkModel = require("../model/GrsLinkModel");


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

    async connexionAUneGameRoom(playerID, gameroomCode){
        let gameRoomService = new GameRoomService();
        let grpLinkservice = new GrpLinkService();
        let gameRoom = await gameRoomService.findGameRoomByCodeAleatoire(gameroomCode);
        let grpLink = new GrpLinkModel(playerID, gameRoom.gameRoomID,0,0,0,0);
        await grpLinkservice.createGrpLink(grpLink);
    }

    async selectRandomSongFromTop25(gameRoomID) {
        const grpLinkService = new GrpLinkService();
        const songService = new SongService();
        const songPlayerLinkService = new SongPlayerLinkService();

        // Récupérer tous les joueurs de la GameRoom
        let grpLinkList = await grpLinkService.findGrpLinkByGameRoomId(gameRoomID);
        let playerIDs = grpLinkList.map(link => link.playerID);

        // Sélectionner un joueur aléatoirement
        let randomPlayerID = playerIDs[Math.floor(Math.random() * playerIDs.length)];

        // Récupérer le top 25 des musiques du joueur
        let top25Songs = await songPlayerLinkService.findSongPlayerLinkByPlayerId(randomPlayerID);

        // Sélectionner une musique aléatoirement parmi le top 25
        let randomSongID = top25Songs[Math.floor(Math.random() * top25Songs.length)].songID;

        let randomSong = await songService.findSongById(randomSongID);

        return randomSong;
    }



    async startGame(gameRoomCode, numberRoundMax){
        let gameRoomService = new GameRoomService();
        let songPlayerLinkService = new SongPlayerLinkService();
        let grpLinkService = new GrpLinkService();
        let playerService = new PlayerService();
        let grsLinkService = new GrsLinkService();

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
            //gameroom.state == false
            //incrémenter les fonctions !

            // Recherche aléatoire de la musique - Amélie
            let randomSong = await this.selectRandomSongFromTop25(gameRoom.gameRoomID);
            console.log("Musique sélectionnée aléatoirement :", randomSong);

            // Vérification du fait que la musique a déjà été jouée - Amélie
            let musiqueDejaJoue = true;
            while(musiqueDejaJoue){
                let grsLinkList = await grsLinkService.findGrsLinkBySongAndGameRoomId(randomSong.songID, gameRoom.gameRoomID);
                if(grsLinkList.length === 0){
                    let grsLink = new GrsLinkModel(gameRoom.gameRoomID, randomSong.songID);
                    await grsLinkService.createGrsLink(grsLink)
                    musiqueDejaJoue = false;
                }
                else{
                    randomSong = await this.selectRandomSongFromTop25(gameRoom.gameRoomID);
                }
            }



            // La musique joue - bridge spotify - Eléa

            //TODO : mettre le endpoint de la lecture de musique
            // await playSong(song.fromSourceID, 10);
            console.log("Début de la musique")
            await delay(2000);
            console.log("Fin de la musique")

            // Attente des réponses du front pour les vote - Elea
            //TODO : Lier à l'endpoint qui renvoie la donnée. Peut être que la requete vienne du front et on fait juste un await ?

            let listOfVotes = this.reponseFrontVote();

            // Check si le vote est bon - Elea

            let songID = randomSong.songID;
            let songPlayerLinkList = await songPlayerLinkService.findSongPlayerLinkBySongId(songID)
            let listOfResults = []
            for (let i = 0; i < listOfVotes.length; i++) {
                let vote = listOfVotes[i];
                let isVoteJuste = songPlayerLinkList.some(link => link.playerID === vote.voteId);
                let player = await playerService.findPlayerById(vote.playerId);
                let playerName = player.user_name;
                if (isVoteJuste) {
                    listOfResults.push({playerId: vote.playerId, playerName: playerName, result: 1})
                    this.updateGrpLinkWinner(gameRoom.gameRoomID, vote.playerId);
                }
                else {
                    listOfResults.push({playerId: vote.playerId, playerName: playerName, result: 0})
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

        // Envoyer les résultats finaux au front
        let grpLinkList = await grpLinkService.findGrpLinkByGameRoomId(gameRoom.gameRoomID)
        let resultatsFinauxList = [];
        for (let i = 0; i < grpLinkList.length; i++) {
            let grpLink = grpLinkList[i];
            let player = await playerService.findPlayerById(grpLink.playerID);
            resultatsFinauxList.push({playerId: grpLink.playerID, playerName: player.user_name, playerPoints: grpLink.playerPoints, averageReactionTime: grpLink.averageReactionTime})
        }
        let jsonResultatsFinaux = JSON.stringify(resultatsFinauxList);
        console.log(jsonResultatsFinaux);
        // TODO: faire le passage du json au front
    }

    reponseFrontVote(){
        return [
            {playerId: 22, voteId: 23},
            {playerId: 23, voteId: 22},
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
