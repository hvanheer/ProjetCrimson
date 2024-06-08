const userDAO = require('../dao/userDAO');

class UserService {
    constructor() {
        this.userDAO = new userDAO();
    }

    async createUser(userGiven) {
        try {
            const createdUser = await this.userDAO.createUser(userGiven);
            return createdUser;
        } catch (err) {
            throw err;
        }
    }
    async deleteUser(userID) {
        try {
            const deletedUser = await this.userDAO.deleteUser(userID);
            return deletedUser;
        } catch (err) {
            throw err;
        }
    }
    async findUserById(userID) {
        try {
            const user = await this.userDAO.findUserById(userID);
            return user;
        } catch (err) {
            throw err;
        }
    }

    async findAllUsers() {
        try {
            const users = await this.userDAO.findAllUsers();
            return users;
        } catch (err) {
            throw err;
        }
    }

    async closeDBConnection() {
        try {
            this.userDAO.closeDBConnection();
        } catch (err) {
            throw err;
        }
    }
}

module.exports = UserService;
