import express from 'express';
import Redis from 'ioredis';
import getUserId from '../utils/getUserId.js';
import ical from 'node-ical';
import DBManager from '../utils/DBManager.js';

const apiRouter = express.Router();

const manager = new DBManager();

const client = new Redis({ host: process.env.REDIS_HOST || 'redis', port: 6379 });

await manager.init_db();

function httpResponse(res, data) {
  const statusCode = data.ok ? 200 : 400;
  res.status(statusCode).send(data);
}

apiRouter.get('/calendars/', async (req, res) => {
  console.log('Got hit: GET calendars');
  try {
    const userId = await getUserId(client, req.get('Authorization'));
    if (!userId) {
      console.log('Verification failed!');
      res.status(500).send();
    }
    console.log('User verified. User ID:', userId);

    const userReminders = await manager.get_calendars(userId);
    console.log('Listing calendars:', userReminders);

    httpResponse(res, userReminders);
  } catch (err) { console.log(err); res.status(500).send(); }
});

apiRouter.post('/add-calendar/', async (req, res) => {
  console.log('Got hit: add calendar');
  try {
    const userId = await getUserId(client, req.get('Authorization'));
    if (!userId) {
      console.log('Verification failed!');
      res.status(500).send();
    }

    console.log('User verified. User ID:', userId);

    const result = await manager.add_calendar(req.body.calendarName, req.body.url, req.body.ttl, userId);
    console.log('Successfully added calendar:', result);
    
    const userReminders = await manager.get_calendars(userId);
    /*
    const events = await ical.async.fromURL(req.body.url);

    for (const [key, value] of Object.entries(events)) {
      const userId = req.session.id;
      const payload = [value.uid, userId, value.summary, value.description, value.start];
      console.log('adding reminder:', payload);
      break;
    }
    */
    
    httpResponse(res, userReminders);
  } catch (error) {
    res.status(500).send();
  }
});

apiRouter.post('/delete-calendar/', async (req, res) => {
  console.log('Got hit: delete calendars', req.body.ids);
  try {
    const userId = await getUserId(client, req.get('Authorization'));
    if (!userId) {
      console.log('Verification failed!');
      res.status(500).send();
    }
    console.log('User verified. User ID:', userId);

    const result = await manager.delete_calendar(calendarId, userId);
    //httpResponse(res, result);
    httpResponse(res, result);
  } catch { res.status(500).send(); }
});

export default apiRouter;
