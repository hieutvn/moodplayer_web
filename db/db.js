import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import os from 'os';

function getDataDir() {
  const base = process.platform === 'win32'
    ? process.env.APPDATA
    : path.join(os.homedir(), '.config');
  const dataDir = path.join(base, 'album-recommender');
  fs.mkdirSync(dataDir, { recursive: true });
  return dataDir;
}

const dbPath = path.join(getDataDir(), 'albums.db');
const db = new Database(dbPath);

function initDb() {

    db.exec(`
        CREATE TABLE IF NOT EXISTS session_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            keyword TEXT,
            
        );
        
        
        `
    )
}



/* function initDb() {

    db.exec(`
        CREATE TABLE IF NOT EXISTS albums (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            artist TEXT NOT NULL,
            year INTEGER,
            genre TEXT,
            spotify_uri TEXT,
            image_url TEXT,
            UNIQUE(name, artist)
        );

        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );
        

        `
)
} */