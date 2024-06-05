class PlayerModel {

    constructor(user_name, spotify, top25){
        this.id = 0;
        this.user_name = user_name;
        this.top25 = top25;
        this.spotify = spotify;
    }
}

module.exports = PlayerModel;