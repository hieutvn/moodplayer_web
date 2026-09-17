import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import os from 'os';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = path.join(__dirname, 'tables');

fs.mkdirSync(DB_DIR, { recursive: true });

function getDataDir() {
    const base = process.platform === 'win32'
        ? process.env.APPDATA
        : path.join(os.homedir(), '.config');
    const dataDir = path.join(base, 'album-recommender');
    fs.mkdirSync(dataDir, { recursive: true });
    return dataDir;
}

const dbPath = path.join(getDataDir(), 'albums.db');
const db = new Database(process.env.DB_PATH || path.join(DB_DIR, 'playlist.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 5000');

db.exec(`
    
    CREATE TABLE IF NOT EXISTS searches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tags TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )    
    
`);

db.exec(`
    
    CREATE TABLE IF NOT EXISTS albums (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        album_name TEXT NOT NULL,
        artist TEXT NOT NULL,
        external_ids TEXT,
        spotify_id TEXT,
        spotify_data TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE (album_name, artist)
    )    
    
`);

db.exec(`
    
    CREATE TABLE IF NOT EXISTS search_results (
        search_id INTEGER NOT NULL REFERENCES searches(id),
        album_id INTEGER NOT NULL REFERENCES albums(id),
        position INTEGER NOT NULL
    )    
    
`);



function saveAlbums(album, artist, external_ids = null) {

    console.log("saving..");

    const insert = db.prepare(` 
        INSERT OR IGNORE INTO albums (album_name, artist, external_ids)
        VALUES (?, ?, ?)
    `).run(album, artist, external_ids);


    /*     const insertMany = db.transaction((albums) => {
    
            for (const [key, value] of albums) {
                insert.run({
                    album_name: value.album,
                    artist: key,
                    external_ids: JSON.stringify(value.external_ids ?? {})
                })
            }
        });
        insertMany(albums); */
    return db
        .prepare('SELECT * FROM albums WHERE album_name = ? AND artist = ?')
        .get(album, artist);
}

function getAlbums() {
    const rows = db.prepare('SELECT * FROM albums ORDER BY id ASC').all();
    return rows.map((row) => ({
        ...row,
        external_ids: JSON.parse(row.external_ids),
    }));
}


export { saveAlbums, getAlbums };


