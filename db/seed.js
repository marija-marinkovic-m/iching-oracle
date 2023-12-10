import sqlite3 from 'sqlite3'

// @TBD: hexagrams table seeder
const db = new sqlite3.Database('./database.sqlite')

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS Hexagrams (id TEXT, binStr TEXT, title TEXT, judgement TEXT, image TEXT, lines TEXT)')

  db.finalize()
})

db.close()
