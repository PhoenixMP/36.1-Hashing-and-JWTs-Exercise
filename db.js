/** Database connection for messagely. */


const { Client } = require("pg");
let DB_URI = {
    user: 'phoenixp',
    host: 'localhost',
    database: '',
    port: 5432,
    password: 'myPassword'
}






if (process.env.NODE_ENV === "test") {
    DB_URI.database = "messagely_test";
} else {
    DB_URI.database = "messagely";
}





let db = new Client(DB_URI);

db.connect();


module.exports = db;
