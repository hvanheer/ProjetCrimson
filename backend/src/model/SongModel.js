class SongModel {

    constructor(songName, songArtists, songAlbum, songReleaseDate){
        this.id = 0;
        this.songName = songName;
        this.songArtists = songArtists;
        this.songAlbum = songAlbum;
        this.songReleaseDate = songReleaseDate
    }
}

module.exports = SongModel;
