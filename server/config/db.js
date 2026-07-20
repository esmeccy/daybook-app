const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "esme",
    password: "daybook1234",
    database: "daybook_app",
    port:8889
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed.", err);
        return;
    }

    console.log(" Connected to database");
});

module.exports = db;