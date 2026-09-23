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
        artist TEXT NOT NULL,
        album_name TEXT NOT NULL,
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

function saveUserSearch(tags) {

    const { lastInsertRowid } = db
        .prepare('INSERT INTO searches (tags) VALUES (?)')
        .run(JSON.stringify(tags));

    return lastInsertRowid;
}


function saveAlbums(artist, album, external_ids = {}) {

    console.log("saving..");

    db
        .prepare(` 
        INSERT OR IGNORE INTO albums (artist, album_name, external_ids)
        VALUES (?, ?, ?)
        `)
        .run(artist, album, JSON.stringify(external_ids));


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

function insertSearchResults(search_id, album_id, position) {

    console.log("done")
    db
        .prepare('INSERT INTO search_results (search_id, album_id, position) VALUES (?, ?, ?)')
        .run(search_id, album_id, position);
}

function updateSpotifyData(spotify_id, spotify_data, album_id) {
    db.prepare('UPDATE albums SET spotify_id = ?, spotify_data = ? WHERE id = ?')
        .run(spotify_id, JSON.stringify(spotify_data), album_id);
}


function getAlbumsFromSearchResults(searchId) {
    const rows = db.prepare(`
        SELECT albums.* 
        FROM search_results 
        JOIN albums ON albums.id = search_results.album_id
        WHERE search_results.search_id = ?
        ORDER BY search_results.position ASC
        `).all(searchId);

    return rows.map((row) => ({
        ...row,
        spotify_data: row.spotify_data ? JSON.parse(row.spotify_data) : null
    }));
}

function getCurrentSessionId(tags) {
    const normalizedTags = JSON.stringify([...tags].sort());

    const search = db.prepare(`
        SELECT id 
        FROM searches
        WHERE tags = ? 
        ORDER BY id DESC LIMIT 1
    `).get(normalizedTags);

    if (!search) { return [] };

    const rowResult = db.prepare(`
        SELECT albums   .spotify_id
        FROM search_results
        JOIN albums ON albums.id = search_results.album_id
        WHERE search_results.search_id = ? 
        AND albums.spotify_id IS NOT NULL
        ORDER BY search_results.position ASC    
    `)
        .all(search.id);

    return rowResult.map((row) => row.spotify_id);
}


export {
    saveUserSearch,
    saveAlbums,
    insertSearchResults,
    updateSpotifyData,
    getAlbumsFromSearchResults,
    getCurrentSessionId

};


