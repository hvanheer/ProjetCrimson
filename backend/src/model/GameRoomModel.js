class GameRoomsModel {

    constructor(){
        this.id = 0;
        this.numberOfPlayers= 0;
        this.state = false;
        this.numberOfRounds = 0;
        this.currentRound = 0;
        this.codeAleatoire = 0;
    }
}

module.exports = GameRoomsModel;

