const userModel = require('../model/userModel');
const mysql = require('mysql');
const {query} = require("mysql/lib/Pool");
// A modifier
const db = mysql.createConnection({host: "localhost", user: "nom_utilisateur", password: "mot_de_passe_utilisateur"});

db.connect(function (err) {
    if (err) throw err;
    console.log("Connecté à la base de données MySQL!");
});

class userDAO {
    constructor() {
        this.userModel = userModel;
    }
}

export async function findUserById() {
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
