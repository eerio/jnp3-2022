import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const DATABASE_PATH = 'db';

// SQL
const CREATE_DATABASE = `CREATE TABLE IF NOT EXISTS calendars 
                        (
                            calendarId INTEGER PRIMARY KEY AUTOINCREMENT,
                            name TEXT,
                            calendarUrl TEXT,
                            ttl INTEGER,
                            userId TEXT
                        );`;

const ADD_CALENDAR = `INSERT INTO calendars (name, calendarUrl, ttl, userId) 
                         VALUES (?, ?, ?, ?);`;

const GET_CALENDARS_USER = `SELECT * FROM calendars 
                         WHERE userId = ? 
                         ORDER BY calendarId DESC 
                         LIMIT ?`;

const DELETE_CALENDAR_ID = `DELETE FROM calendars 
                         WHERE calendarId = ? AND userId = ?`;

class DBManager {
  async init_db() {
    this.db = await open({ filename: DATABASE_PATH, driver: sqlite3.Database, verbose: true });
    await this.db.run(CREATE_DATABASE);
  }

  async db_run(cmd, args, fieldName = '') {
    try {
      return { ok: true, [fieldName]: await this.db.all(cmd, args) };
    } catch (e) {
      return { ok: false, err: e };
    }
  }

  async add_calendar(name, calendarUrl, ttl, userId) {
    return this.db_run(ADD_CALENDAR, [name, calendarUrl, ttl, userId]);
  }

  async get_calendars(userId, limit = 25) {
    return this.db_run(GET_CALENDARS_USER, [userId, limit], 'calendars');
  }

  async delete_calendar(calendarId, userId) {
    return this.db_run(DELETE_CALENDAR_ID, [calendarId, userId]);
  }
}

export default DBManager;
