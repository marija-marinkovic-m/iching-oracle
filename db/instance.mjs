import sqlite3 from 'sqlite3'
import logger from '../src/logger.mjs'

let db

const initDB = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database('./db/database.sqlite', (err) => {
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
    db.run('CREATE TABLE IF NOT EXISTS Readings (id TEXT, hexBinStr TEXT, kingWen TEXT, changingLines TEXT, question TEXT, createdAt TEXT)', (err) => {
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
    if (!db) {
      await initDB()
      await initTables(db)
    }
    return db
  } catch (err) {
    logger.error(err.message)
  }
}

export const storeReading = async (reading) => {
  const db = await getDB()
  const { id, hexbinStr, kingWen, changingLines, question, createdAt } = reading
  const stmt = db.prepare('INSERT INTO Readings VALUES (?, ?, ?, ?, ?, ?)')
  await stmt.run(id, hexbinStr, kingWen, changingLines, question, createdAt)
  stmt.finalize()

  const row = await getReading(id)

  return row
}

export const getReadings = async () => {
  const db = await getDB()
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM Readings ORDER BY createdAt DESC LIMIT 50', (err, rows) => {
      if (err) {
        logger.error(err.message)
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

export const searchReadingsByQuestion = async (question) => {
  const db = await getDB()
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM Readings WHERE question LIKE ?', [question], (err, row) => {
      if (err) {
        logger.error(err.message)
        reject(err)
      } else {
        resolve(row)
      }
    })
  })
}

export const searchReadingsByKingWen = async (kingWen) => {
  const db = await getDB()
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM Readings WHERE kingWen LIKE ?', [kingWen], (err, rows) => {
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

export const deleteReading = async (id) => {
  const db = await getDB()
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM Readings WHERE id = ?', [id], (err) => {
      if (err) {
        logger.error(err.message)
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export const searchReadings = async (query) => {
  const db = await getDB()
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM Readings WHERE question LIKE ?', [`%${query}%`], (err, rows) => {
      if (err) {
        logger.error(err.message)
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}
