import sqlite3 from 'sqlite3'
import logger from '../src/logger.mjs'

const initDB = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./db/database.db', (err) => {
      if (err) {
        logger.error(err.message)
        reject(err)
      } else {
        resolve(db)
      }
    })
  })
}

const initTables = (db) => {
  return new Promise((resolve, reject) => {
    db.run('CREATE TABLE IF NOT EXISTS Readings (id TEXT, hexBinStr TEXT, changingLines TEXT, question TEXT, createdAt TEXT)', (err) => {
      if (err) {
        logger.error(err.message)
        reject(err)
      } else {
        resolve(db)
      }
    })
  })
}

const getDB = async () => {
  try {
    const db = await initDB()
    await initTables(db)
    return db
  } catch (err) {
    logger.error(err.message)
  }
}

export const storeReading = async (reading) => {
  const db = await getDB()
  const { id, hexbinStr, changingLines, question, createdAt } = reading
  const stmt = db.prepare('INSERT INTO Readings VALUES (?, ?, ?, ?, ?)')
  stmt.run(id, hexbinStr, changingLines, question, createdAt)
  stmt.finalize()
}

export const getReadings = async () => {
  const db = await getDB()
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM Readings', (err, rows) => {
      if (err) {
        logger.error(err.message)
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

export const getReading = async (id) => {
  const db = await getDB()
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM Readings WHERE id = ?', [id], (err, row) => {
      if (err) {
        logger.error(err.message)
        reject(err)
      } else {
        resolve(row)
      }
    })
  })
}
