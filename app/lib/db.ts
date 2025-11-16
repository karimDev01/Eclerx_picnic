import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database;

export function getDb() {
  if (!db) {
    const dbPath = process.env.NODE_ENV === 'production' 
      ? '/tmp/picnics.db' 
      : path.join(process.cwd(), 'picnics.db');
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initializeDb();
  }
  return db;
}

function initializeDb() {
  // Create picnics table
  db.exec(`
    CREATE TABLE IF NOT EXISTS picnics (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      maxPeople INTEGER NOT NULL,
      registrationDeadline TEXT NOT NULL,
      upiId TEXT NOT NULL,
      adminId TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  // Create registrations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id TEXT PRIMARY KEY,
      picnicId TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      upiId TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      createdAt TEXT NOT NULL,
      FOREIGN KEY (picnicId) REFERENCES picnics(id)
    )
  `);
}
