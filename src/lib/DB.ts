import sqlite from "better-sqlite3";

const db = sqlite('./DB.sqlite');
db.pragma('journal_mode = WAL');
db.exec(`CREATE TABLE IF NOT EXISTS roles (
    uuid TEXT PRIMARY KEY,
    role TEXT,
    username TEXT
);
CREATE TABLE IF NOT EXISTS user (
    id INTEGER NOT NULL PRIMARY KEY,
    googleId TEXT,
    minecraftId TEXT,
    username TEXT
    
);
CREATE TABLE IF NOT EXISTS session (
    id TEXT NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES user(id),
    expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS skinlayout (
    id INTEGER NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES user(id),
    edit_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    role TEXT DEFAULT "user",
    name TEXT NOT NULL,
    data TEXT NOT NULL
);

`);
export default db;
process.on('exit', () => {
    db.close();
    console.log('Base de données fermée.');
});
export type SkinLayout={
    id:number,
    user_id:number,
    edit_at:string,
    name:string,
    data:string,
}