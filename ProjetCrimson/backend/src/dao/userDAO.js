const userModel = require('../model/userModel');
const connexionManager = require('../persistence/connexionManager');
//const {query} = require("mysql/lib/Pool"); // Pas utile si utilisation de mysql-async-simple.

class userDAO {

    constructor() {
        //this.userModel = userModel; // Necessary ?
        this.connexionManager = connexionManager;
    }

    export async function createUser(userGiven) {
        try {
            const dbParameters = await this.connexionManager.getConnexion();
            const db = dbParemeters[0];
            const connexion = dbParemeters[1];
            const createdUser = await db.query(connexion, 'INSERT INTO users(nom, topMusiques) VALUES(?, ?)', [userGiven.userId], [userGiven.topMusiques]);
            return createdUser;
        } catch (err) {
            throw err;
        } finally {
            await db.close(connexion);
        }
    }

    export async function findUserById(userId) {
        try {
            const user = await query('SELECT * FROM users WHERE id = ?', [userId]);
            return user[0];
        } catch (err) {
            throw err;
        }
    }

    export async function findAllUser() {
        try {
            const users = await query('SELECT id, nom, prenom, email, naissance FROM Client;');
            return users;
        } catch (err) {
            throw err;
        }
    }
}
