import express from 'express';
import Redis from 'ioredis';
import getUserId from '../utils/getUserId.js';
import DBManager from '../utils/DBManager.js';

const apiRouter = express.Router();

const manager = new DBManager();

const client = new Redis({ host: process.env.REDIS_HOST || 'redis', port: 6379 });

await manager.init_db();

function httpResponse(res, data) {
  const statusCode = data.ok ? 200 : 400;
  res.status(statusCode).send(data);
}

const makeApiCall = (data, url, token, mthd = 'GET') => fetch(url, {
  method: mthd,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: token,
  },
  body: JSON.stringify(data),
}).then((res) => res.json());

const refresh = async (token) => {
  const userId = await getUserId(client, token);
  console.log('Reminders: refreshing for user:', userId);
  const res = await makeApiCall(undefined, `http://calendars:8080/api/refresh/`, token);
  console.log('Success!', res);
};

apiRouter.get('/list-reminders-soft/', async (req, res) => {
  try {
    const userId = await getUserId(client, req.get('Authorization'));
    console.log('Listing reminders for:', userId);
    const userReminders = await manager.get_reminders(userId);

    httpResponse(res, userReminders);
  } catch (err) { console.log(err); res.status(500).send(); }
});

apiRouter.get('/list-reminders/', async (req, res) => {
  try {
    const userId = await getUserId(client, req.get('Authorization'));
    console.log('Listing reminders for:', userId);
    const userReminders_pre = await manager.get_reminders(userId);
    await refresh(req.get('Authorization'));
    const userReminders = await manager.get_reminders(userId);

    httpResponse(res, userReminders);
  } catch (err) { console.log(err); res.status(500).send(); }
});

apiRouter.post('/add-reminder/', async (req, res) => {
  try {
    console.log('add-reminer: body=', req.body);
    const {
      calendarId, userId, reminderName, description, date,
    } = req.body;
    console.log(calendarId, userId, reminderName);

    const result = await manager.create_reminder(userId, calendarId, description, reminderName, date);
    console.log('hit add reminder');

    httpResponse(res, result);
  } catch (err) {console.log(err);  res.status(500).send(); }
});

apiRouter.post('/delete-reminder/', async (req, res) => {
  try {
    const { reminderId } = req.body;

    const result = await manager.delete_reminder(reminderId);

    httpResponse(res, result);
  } catch { res.status(500).send(); }
});

apiRouter.get('/delete-old-reminders/', async (req, res) => {
  try {
    console.log('got delete');
    const currentDate = (new Date()).toISOString().split('T')[0];

    const result = await manager.delete_reminders_before(currentDate);

    httpResponse(res, result);
  } catch { res.status(500).send(); }
});

apiRouter.post('/delete-calendars-reminders/', async (req, res) => {
  try {
    const { calendarId } = req.body;

    const result = await manager.delete_calendars_reminders(calendarId);

    httpResponse(res, result);
  } catch { res.status(500).send(); }
});

export default apiRouter;
