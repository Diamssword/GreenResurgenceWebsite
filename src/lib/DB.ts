import sqlite from "sqlite3";

const db = new sqlite.Database('./DB.sqlite');
db.run(`CREATE TABLE IF NOT EXISTS roles (
    uuid TEXT PRIMARY KEY,
    role TEXT,
    username TEXT
)`, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Table roles created successfully.');
});
export default db;
process.on('exit', () => {
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Base de données fermée.');
    });
});