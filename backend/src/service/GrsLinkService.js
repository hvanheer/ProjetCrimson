const grsLinkDAO = require('../dao/GrsLinkDAO');

class GrsLinkService {
    constructor() {
        this.grsLinkDAO = new grsLinkDAO();
    }

    async createGrsLink(grsLink) {
        try {
            return await this.grsLinkDAO.createGrsLink(grsLink);
        } catch (err) {
            throw err;
        }
    }

    async findGrsLinkByGameRoomId(gameRoomID) {
        try {
            return await this.grsLinkDAO.findGrsLinkByGameRoomId(gameRoomID);
        } catch (err) {
            throw err;
        }
    }
    async findGrsLinkBySongId(songID) {
        try {
            return await this.grsLinkDAO.findGrsLinkBySongId(songID);
        } catch (err) {
            throw err;
        }
    }

    async findAllGrsLink() {
        try {
            return await this.grsLinkDAO.findAllGrsLink();
        } catch (err) {
            throw err;
        }
    }

    async closeDBConnection() {
        try {
            await this.grsLinkDAO.closeDBConnection();
        } catch (err) {
            throw err;
        }
    }
}

module.exports = GrsLinkService;
