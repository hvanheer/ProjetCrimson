const connexionManager = require('../persistence/connexionManager');

class UserDAO {
    constructor() {
        this.connexionManager = new connexionManager();
    }

    async createUser(userGiven) {
        try {
            const db = await this.connexionManager.getDbConnection();
            const createdUser = await db.query(this.connexionManager.connection, 'INSERT INTO user(user_name) VALUES(?)', [userGiven.name]);
            return createdUser;
        } catch (err) {
            throw err;
        }
    }

    async findUserById(userID) {
        try {
            const db = await this.connexionManager.getDbConnection();
            const user = await db.query(this.connexionManager.connection, 'SELECT * FROM user WHERE ID_user = ?', [userID]);
            return user[0];
        } catch (err) {
            throw err;
        }
    }

    async findAllUsers() {
        try {
            const db = await this.connexionManager.getDbConnection();
            const users = await db.query(this.connexionManager.connection, 'SELECT * FROM user');
            return users;
        } catch (err) {
            throw err;
        }
    }

    async closeDBConnection() {
        try {
            await this.connexionManager.closeDB();
        } catch (err) {
            throw err;
        }
    }
}

module.exports = UserDAO;
