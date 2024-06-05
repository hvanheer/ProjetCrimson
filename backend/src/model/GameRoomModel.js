class GameRoomsModel {

    constructor(connexion_code, numberOfPlayers, state, numberOfRounds, currentRound){
        this.id = 0;
        this.connexion_code = connexion_code;
        this.numberOfPlayers= numberOfPlayers;
        this.state = state;
        this.numberOfRounds = numberOfRounds;
        this.currentRound = currentRound;
        this.codeAleatoire = 0;
    }
}

module.exports = GameRoomsModel;

