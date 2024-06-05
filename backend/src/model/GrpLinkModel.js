class GrpLinkModel {

    constructor(player_id, game_room_id, playerPoints, playerRank, guessedSongs, averageReactionTime){
        this.player_id = player_id;
        this.game_room_id = game_room_id;
        this.playerPoints = playerPoints;
        this.playerRank = playerRank;
        this.guessedSongs = guessedSongs;
        this.averageReactionTime = averageReactionTime
    }
}

module.exports = GrpLinkModel;
