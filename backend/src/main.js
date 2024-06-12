const UserService = require('./service/userService');
const UserModel = require('./model/userModel');
const GameRoomModel = require('./model/GameRoomModel');
const GameRoomService = require('./service/GameRoomService');
const SongModel = require('./model/SongModel');
const SongService = require('./service/SongService');
const PlayerModel = require('./model/PlayerModel');
const PlayerService = require('./service/PlayerService');
const GrpLinkModel = require('./model/GrpLinkModel');
const GrpLinkService = require('./service/GrpLinkService');
const GrsLinkModel = require('./model/GrsLinkModel');
const GrsLinkService = require('./service/GrsLinkService');
const SongPlayerLinkModel = require('./model/SongPlayerLinkModel');
const SongPlayerLinkService = require('./service/SongPlayerLinkService');
const GameService = require('./service/GameService');
const fs = require('fs');
const path = require('path');


async function fetchAllUsers() {
    try {
        const userModelInstance = new UserModel("Guillaume", "top25");
        const userService = new UserService();
        // const user1 = await userService.createUser(userModelInstance);
        // console.log(user1);
        // const userSearched = await userService.findUserById(3);
        // console.log(userSearched);
        // console.log(userSearched["ID_user"]);
        // console.log(userSearched["user_name"]);
        const allUsers = await userService.findAllUsers();
        console.log(allUsers);
        userService.closeDBConnection();
    } catch (err) {
        console.error('Error fetching all users:', err);
    }
}

// fetchAllUsers();

testsDB();


function testsDB() {
    //testGameRooms();
    //testSong();
    testPlayer();
    // testGrpLink()
    // testGrsLink();
    // testSongPlayerLink();
    // testGameService();
}

function testGameRooms() {
    const gameRoom = new GameRoomModel();
    const gameRoomService = new GameRoomService();
    // testCreationGameRoom(gameRoom, gameRoomService);
    // testListGameRoom(gameRoom, gameRoomService);
    //testUpdateGr(gameRoomService);
    //testDeleteGR(gameRoomService)
    //testfindGrByCodeAleatoire(gameRoomService)
}
async function testfindGrByCodeAleatoire(gameRoomService) {
    try{
        const gameRoom = await gameRoomService.findGameRoomByCodeAleatoire(14795);
        console.log(gameRoom)
    }catch (err) {
        console.log(err)
    }
}

async function testDeleteGR( gameRoomService) {
    try{
        gameRoomService.deleteGameRoom(6);
    }catch (err) {
        console.log(err)
    }
}
async function testUpdateGr(gameRoomService) {
    try{
        let gameRoom = await gameRoomService.findGameRoomById(2);
        gameRoom.numberOfPlayers +=1;
        gameRoom.numberOfRounds = 10;
        console.log(gameRoom);
        gameRoomService.updateGameRoom(gameRoom);
    }catch (e) {
        console.log(e)
    }
}

function testCreationGameRoom(gameRoom, gameRoomService) {
        try{
        gameRoomService.createGameRoom(gameRoom);
    }catch (err) {
        console.log(err)
    }
}



async function testListGameRoom(gameRoom, gameRoomService) {
    try {
        let allgameRooms = await gameRoomService.findAllGameRoom();
        let gamerooms = await gameRoomService.findGameRoomById(2);
        console.log(allgameRooms)
        console.log(gamerooms)
    } catch (e) {
        console.log(err)
    }
}


function testSong() {
    const song = new SongModel(12, 'NomMusique', 'Bob', 'Boby', new Date(2024,2,2));
    const songService = new SongService();
    // testCreateSong(song, songService);
    //testListSong(songService);
    //testfindBySourceID(songService)
    testUpdateSong(updatedSong,songService)

}

async function testUpdateSong(updatedSong,songService) {
    try {
        const new_song = await songService.updateSong(updatedSong);
        console.log('Chanson modifiée:', new_song);
    } catch (err) {
        console.error('Error updating song:', err);
    }
}

async function testfindBySourceID(songService){
    const songs = await songService.findBySourceId(4)
    console.log(songs)
}

function testCreateSong(song, songService) {
    songService.createSong(song);
}

async function testListSong(songService) {
    const allSongs = await songService.findAllSongs();
    const thisSong = await songService.findSongById(2);
    console.log(allSongs);
    console.log(thisSong);
}

function readJsonFileSync(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

function testPlayer() {


    const jsonFilePath = path.join(__dirname, './api/top_tracks.json');
    const top25Data = readJsonFileSync(jsonFilePath);

    const player = new PlayerModel('Amandine', true, top25Data);
    const playerService = new PlayerService();
    testCreatePlayer(player, playerService);
    //testListPlayers(playerService);
    // testUpdatePlayer(playerService)
}

function testCreatePlayer(player, playerService) {
    try {
        playerService.createPlayer(player);
    } catch (err) {
        console.error('Error creating player:', err);
    }
}
async function testUpdatePlayer(playerService) {
    try {
        let player = await playerService.findPlayerById(10);
        player.user_name = "Adam";
        player.spotify = 0;
        console.log(player);
        const nouveau_joueur = await playerService.updatePlayer(player);
        console.log('Joueur modifié:', nouveau_joueur);
    } catch (err) {
        console.error('Error updating player:', err);
    }
}
async function testListPlayers(playerService) {
    try {
        const allPlayers = await playerService.findAllPlayers();
        console.log('All players:', allPlayers);
        const player = await playerService.findPlayerById(7);
        console.log('Player found by ID:', player);
    } catch (err) {
        console.error('Error fetching all players:', err);
    }
}

function testGrpLink() {
    const player_id = 9;
    const game_room_id = 6;
    const playerPoints = 0;
    const playerRank = 0;
    const guessedSongs = "song";
    const gameRoomID = 6
    const playerID = 9
    const averageReactionTime = 2.5;
    const grpLink = new GrpLinkModel(player_id, game_room_id, playerPoints, playerRank, guessedSongs, averageReactionTime);
    const grpLinkService = new GrpLinkService();
    // testCreateGrpLink(grpLink, grpLinkService);
    // testFindGrpLinkByGameRoomId(2, grpLinkService);
    // testFindGrpLinkByPlayerId(7, grpLinkService);
    // testListGrpLinks(grpLinkService);
    // testDeleteGrpLink(gameRoomID, playerID,grpLinkService)
    testUpdateGrpLink(gameRoomID, playerID, updatedGrpLink,grpLinkService)
}

async function testUpdateGrpLink(gameRoomID, playerID, updatedGrpLink,grpLinkService) {
    try {
        const nvGrpLink = await grpLinkService.updateGrpLink(gameRoomID, playerID, updatedGrpLink);
        console.log('GrpLink modifié:', nvGrpLink);
    } catch (err) {
        console.error('Error updating GrpLink:', err);
    }
}
async function testCreateGrpLink(grpLink, grpLinkService) {
    try {
        const createdGrpLink = await grpLinkService.createGrpLink(grpLink);
        console.log('Created GrpLink:', createdGrpLink);
    } catch (err) {
        console.error('Error creating GrpLink:', err);
    }
}

async function testDeleteGrpLink(gameRoomID, playerID, grpLinkService) {
    try {
        grpLinkService.deleteGrpLink(gameRoomID, playerID);
    } catch (err) {
        console.error('Error deleting GrpLink:', err);
    }
}

async function testFindGrpLinkByGameRoomId(gameRoomId, grpLinkService) {
    try {
        const grpLink = await grpLinkService.findGrpLinkByGameRoomId(gameRoomId);
        console.log('GrpLink found by GameRoom ID:', grpLink);
    } catch (err) {
        console.error('Error finding GrpLink by GameRoom ID:', err);
    }
}

async function testFindGrpLinkByPlayerId(playerId, grpLinkService) {
    try {
        const grpLink = await grpLinkService.findGrpLinkByPlayerId(playerId);
        console.log('GrpLink found by Player ID:', grpLink);
    } catch (err) {
        console.error('Error finding GrpLink by Player ID:', err);
    }
}

async function testListGrpLinks(grpLinkService) {
    try {
        const allGrpLinks = await grpLinkService.findAllGrpLink();
        console.log('All GrpLinks:', allGrpLinks);
    } catch (err) {
        console.error('Error fetching all GrpLinks:', err);
    }
}

async function testGrsLink() {
    const game_room_id = 7;
    const songs_id = 24;

    const grsLink = new GrsLinkModel(game_room_id, songs_id);
    const grsLinkService = new GrsLinkService();

    // testCreateGrsLink(grsLink, grsLinkService);
    // testFindGrsLinkByGameRoomId(2, grsLinkService);
    // testFindGrsLinkBySongId(2, grsLinkService);
    // testListGrsLinks(grsLinkService);
    let grsLinkList = await grsLinkService.findGrsLinkBySongAndGameRoomId(songs_id, game_room_id);
    console.log(grsLinkList);
}
async function testCreateGrsLink(grsLink, grsLinkService) {
    try {
        const createdGrsLink = await grsLinkService.createGrsLink(grsLink);
        console.log('Created GrsLink:', createdGrsLink);
    } catch (err) {
        console.error('Error creating GrsLink:', err);
    }
}

async function testFindGrsLinkByGameRoomId(gameRoomId, grsLinkService) {
    try {
        const grsLink = await grsLinkService.findGrsLinkByGameRoomId(gameRoomId);
        console.log('GrsLink found by GameRoom ID:', grsLink);
    } catch (err) {
        console.error('Error finding GrsLink by GameRoom ID:', err);
    }
}

async function testFindGrsLinkBySongId(songId, grsLinkService) {
    try {
        const grsLink = await grsLinkService.findGrsLinkBySongId(songId);
        console.log('GrsLink found by Song ID:', grsLink);
    } catch (err) {
        console.error('Error finding GrsLink by Song ID:', err);
    }
}

async function testListGrsLinks(grsLinkService) {
    try {
        const allGrsLinks = await grsLinkService.findAllGrsLink();
        console.log('All GrsLinks:', allGrsLinks);
    } catch (err) {
        console.error('Error fetching all GrsLinks:', err);
    }
}

function testSongPlayerLink() {
    const player_id = 7;
    const songs_id = 2;

    const songPlayerLink = new SongPlayerLinkModel(player_id, songs_id);
    const songPlayerLinkService = new SongPlayerLinkService();

    // testCreateSongPlayerLink(songPlayerLink, songPlayerLinkService);
    // testFindSongPlayerLinkByPlayerId(7, songPlayerLinkService);
    // testFindSongPlayerLinkBySongId(2, songPlayerLinkService);
    testListSongPlayerLinks(songPlayerLinkService);
}

async function testCreateSongPlayerLink(songPlayerLink, songPlayerLinkService) {
    try {
        const createdSongPlayerLink = await songPlayerLinkService.createSongPlayerLink(songPlayerLink);
        console.log('Created SongPlayerLink:', createdSongPlayerLink);
    } catch (err) {
        console.error('Error creating SongPlayerLink:', err);
    }
}

async function testFindSongPlayerLinkByPlayerId(playerId, songPlayerLinkService) {
    try {
        const songPlayerLink = await songPlayerLinkService.findSongPlayerLinkByPlayerId(playerId);
        console.log('SongPlayerLink found by Player ID:', songPlayerLink);
    } catch (err) {
        console.error('Error finding SongPlayerLink by Player ID:', err);
    }
}

async function testFindSongPlayerLinkBySongId(songId, songPlayerLinkService) {
    try {
        const songPlayerLink = await songPlayerLinkService.findSongPlayerLinkBySongId(songId);
        console.log('SongPlayerLink found by Song ID:', songPlayerLink);
    } catch (err) {
        console.error('Error finding SongPlayerLink by Song ID:', err);
    }
}

async function testListSongPlayerLinks(songPlayerLinkService) {
    try {
        const allSongPlayerLinks = await songPlayerLinkService.findAllSongPlayerLink();
        console.log('All SongPlayerLinks:', allSongPlayerLinks);
    } catch (err) {
        console.error('Error fetching all SongPlayerLinks:', err);
    }
}

function testGameService() {
    let gameService = new GameService();
    try {
        // gameService.creationGameRoomParLePlayer(7, 15);
        gameService.startGame(3185,2);

    }catch (e) {
        console.log(e)
    }

}
