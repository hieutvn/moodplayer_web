CREATE TABLE IF NOT EXISTS sessionPlaylists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    artist TEXT,
    album TEXT,
    tag TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))            
);   

CREATE TABLE IF NOT EXISTS sessionPlaylistsTest (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    artist TEXT,
    album TEXT,
    tag TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))            
);  

CREATE TABLE IF NOT EXISTS savedTags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tags TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))            
);   


CREATE TABLE IF NOT EXISTS playlists (

    id UUID PRIMARY KEY DEFAULT AUTOINCREMENT,
    owner_id TEXT NOT NULL,
    name TEXT NOT NULL,
    current_idx INTEGER NOT NULL DEFAULT 0
    created_at TEXT DEFAULT (datetime('now')),
    
);

/* CREATE TABLE IF NOT EXISTS playlist_albums (



); */