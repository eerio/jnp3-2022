import express from 'express';
import Redis from 'ioredis';
import getUserId from '../utils/getUserId.js';
import ical from 'node-ical';

const apiRouter = express.Router();

const client = new Redis({ host: process.env.REDIS_HOST || 'redis', port: 6379 });

function httpResponse(res, data) {
  const statusCode = data.ok ? 200 : 400;
  res.status(statusCode).send(data);
}

apiRouter.get('/calendars/', async (req, res) => {
  console.log('Got hit: GET calendars');
  try {
    const userId = await getUserId(client, req.get('Authorization'));
    console.log(userId);
    const userReminders = await manager.get_reminders(userId);

    httpResponse(res, userReminders);
  } catch (err) { console.log(err); res.status(500).send(); }
});

apiRouter.post('/add-calendar/', async (req, res) => {
  console.log('Got hit: add calendar, jwt:', req.get('Authorization'));
  try {
    const userId = await getUserId(client, req.get('Authorization'));
    if (!userId) {
      console.log('Verification failed!');
      res.status(500).send();
    }

    console.log('User verified. User ID:', userId);

    const events = await ical.async.fromURL(req.body.url);

    for (const [key, value] of Object.entries(events)) {
      const userId = req.session.id;
      const payload = [value.uid, userId, value.summary, value.description, value.start];
      console.log('adding reminder:', payload);
      break;
    }
    res.status(200).send();
  } catch (error) {
    res.status(400).send();
  }
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
