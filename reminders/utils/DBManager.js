import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const DATABASE_PATH = '/data/db';

// SQL
const CREATE_DATABASE = `CREATE TABLE IF NOT EXISTS reminders 
                        (
                            reminderId INTEGER PRIMARY KEY AUTOINCREMENT,
                            calendarId INTEGER,
                            userId TEXT, 
                            description TEXT,
                            name TEXT,
                            date TEXT
                        );`;

const ADD_REMINDER = `INSERT INTO reminders (calendarId, userId, description, name,  date) 
                         VALUES (?, ?, ?, ?, ?);`;

const GET_REMINDERS_USER = `SELECT * FROM reminders 
                         WHERE userId = ? 
                         ORDER BY reminderId DESC 
                         LIMIT ?`;

const DELETE_REMINDER_ID = `DELETE FROM reminders 
                         WHERE reminderId = ? AND userId = ?`;

const DELETE_OLD_REMINDERS = `DELETE FROM reminders 
                          WHERE DATE(date) < DATE(?)`;

const DELETE_CALENDARS_REMINDERS = `DELETE FROM reminders 
                          WHERE calendarId = ?`;

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

  async create_reminder(userId, calendarId, description, name, date) {
    return this.db_run(ADD_REMINDER, [calendarId, userId, description, name, date]);
  }

  async get_reminders(userId, limit = 25) {
    return this.db_run(GET_REMINDERS_USER, [userId, limit], 'reminders');
  }

  async delete_reminder(reminderId, userId) {
    return this.db_run(DELETE_REMINDER_ID, [reminderId, userId]);
  }

  async delete_reminders_before(currentDate) {
    return this.db_run(DELETE_OLD_REMINDERS, [currentDate]);
  }

  async delete_calendars_reminders(calendarId) {
    return this.db_run(DELETE_CALENDARS_REMINDERS, [calendarId]);
  }
}

export default DBManager;
