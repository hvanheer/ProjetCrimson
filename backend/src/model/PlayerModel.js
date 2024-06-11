class PlayerModel {

    constructor(user_name, spotify, top25, token){
        this.id = 0;
        this.user_name = user_name;
        this.top25 = top25;
        this.spotify = spotify;
        this.token = "0";
    }
}

module.exports = PlayerModel;