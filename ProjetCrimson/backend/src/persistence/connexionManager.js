const { makeDb } = require('mysql-async-simple');
const mysql = require('mysql');

class connexionManager {

    const connection = mysql.createConnection({
        host: "localhost",
        user: "nom_utilisateur",
        password: "mot_de_passe_utilisateur"
    });

    const db = null;

    async function initDB() {
        if (db === null) {
            const db = makeDb();
            await db.connect(connection);
        }
    }

    export async function getConnexion() {
        await this.initDB();
        return [db, connection];
    }

}