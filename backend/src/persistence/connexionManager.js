const { makeDb } = require('mysql-async-simple');
const mysql = require('mysql');

let db = null;

class ConnexionManager {
    constructor() {
        this.connection = mysql.createConnection({
            host: "54.38.241.241",
            user: "root",
            password: "dgcbuHBCWQIbde8724257?!!",
            database: "crimsonV2"
        });
        if (db === null) {
            this.db = makeDb();
        } else {
            this.db = db;
        }
    }

    async closeDB() {
        if (this.connection) {
            console.log("Fermeture de la connection !");
            await this.db.close(this.connection);
            console.log("Connection fermee !");
        }
    }

    async getDbConnection() {
        console.log("here");
        if (!this.connection) {
            console.log("Ouverture de la connexion !");
            this.connection = await this.db.connect(this.connection);
            console.log("Connexion ouverte !");
        }
        return this.db;
    }
}

module.exports = ConnexionManager;
