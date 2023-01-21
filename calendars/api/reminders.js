import express from 'express';
import Redis from 'ioredis';
import getUserId from '../utils/getUserId.js';
import ical from 'node-ical';

const apiRouter = express.Router();

function httpResponse(res, data) {
  const statusCode = data.ok ? 200 : 400;
  res.status(statusCode).send(data);
}

apiRouter.get('/calendars/', async (req, res) => {
  console.log('Got hit: GET calendars');
  try {
    const userId = await getUserId(undefined, req.get('Authorization'));
    console.log(userId);
    const userReminders = await manager.get_reminders(userId);

    httpResponse(res, userReminders);
  } catch (err) { console.log(err); res.status(500).send(); }
});

apiRouter.post('/add-calendar/', async (req, res) => {
  console.log('Got hit: add calendar', req.body);
  const events = await ical.async.fromURL(req.body.url);
  console.log('events:', events);
  /*
  try {
    const {
      calendarId, userId, reminderName, description, date,
    } = req.body;

    const result = await manager.create_reminder(userId, calendarId, description, reminderName, date);
    console.log('hit add reminder');

    httpResponse(res, result);
  } catch { res.status(500).send(); }
  */
});

apiRouter.post('/delete-calendar/', async (req, res) => {
  console.log('Got hit: delete calendar', req.body);
  try {
    const { reminderId } = req.body;

    const result = await manager.delete_reminder(reminderId);

    httpResponse(res, result);
  } catch { res.status(500).send(); }
});

export default apiRouter;
