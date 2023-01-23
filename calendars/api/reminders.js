import express from 'express';
import Redis from 'ioredis';
import getUserId from '../utils/getUserId.js';
import ical from 'node-ical';
import DBManager from '../utils/DBManager.js';
import moment from 'moment-timezone';

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


async function getAllCloseEvents(calendarId, userId, url, ttl, token, close=86400 * 1000) {
  await ical.fromURL(url, {}, async function (err, data) {
    
    console.log(err);
    for (let k in data) {
        if (!Object.prototype.hasOwnProperty.call(data, k)) continue;

        const event = data[k];
        if (event.type !== 'VEVENT') continue;
        if (!event.rrule) {
          console.log('Non recurrent event:', event.summary);
          //console.log(new Date() < event.start, event.start < new Date().getTime() + close, event.start, new Date().getTime() + close); 
          // TODO: WYWALIC TUTAJ TEN  '- close' - to jest tylko zeby pokazywalo moj recurrent event z ZPP
          // u dolu jest ten sam kod do dodawania recurrent!!
          if (new Date().getTime() - close  < event.start && event.start < new Date().getTime() + ttl * 1000) {
            console.log('Adding reminder!');
        await makeApiCall(
          {calendarId:calendarId, userId:userId, reminderName:event.summary, description:event.description, date:event.begin},
          'http://reminders:8080/api/add-reminder/', token, 'POST'
        );
          }
          continue;
        };
      console.log('Recurrent event:', event.summary);
        
        //console.log(' get between:', new Date(), new Date((new Date().getTime()) + close));
        const dates = event.rrule.between(new Date((new Date().getTime()) - close), new Date((new Date().getTime()) + close));
      //console.log('Dates:', dates);
        if (dates.length === 0) continue;

        //console.log('Summary:', event.summary);
        //console.log('Original start:', event.start);
        //console.log('RRule start:', `${event.rrule.origOptions.dtstart} [${event.rrule.origOptions.tzid}]`)

        //dates.forEach(date => {
        //for( let date of dates) {
        var small_events = dates.map((date) => {
            let newDate;
            if (event.rrule.origOptions.tzid) {
                // tzid present (calculate offset from recurrence start)
                const dateTimezone = moment.tz.zone('UTC')
                const localTimezone = moment.tz.guess()
                const tz = event.rrule.origOptions.tzid === localTimezone ? event.rrule.origOptions.tzid : localTimezone
                const timezone = moment.tz.zone(tz)
                const offset = timezone.utcOffset(date) - dateTimezone.utcOffset(date)
                newDate = moment(date).add(offset, 'minutes').toDate()
            } else {
                // tzid not present (calculate offset from original start)
                newDate = new Date(date.setHours(date.getHours() - ((event.start.getTimezoneOffset() - date.getTimezoneOffset()) / 60)))
            }
            const start = moment(newDate)
            //console.log('Recurrence start:', start)
          
          //console.log(new Date() < start, start < new Date().getTime() + ttl * 1000);
          console.log('event:', start);
          //if (new Date() < start && start < new Date().getTime() + ttl * 1000) {
          if (new Date().getTime() - close  < event.start && event.start < new Date().getTime() + ttl * 1000) {
            return {description: event.description, name: event.summary, date: start};
          }
          //console.log(events);
          return null;
        });
      //console.log('events:', events)
      //events = events.concat(small_events);
      
      const current_reminders = await makeApiCall(undefined, 'http://reminders:8080/api/list-reminders-soft/', token);
      console.log('current reminders:', current_reminders);
      for (let ev of small_events) {
       if (!ev) { continue; } 
        console.log('Adding reminder:', ev.name);
        await makeApiCall(
          {calendarId:calendarId, userId:userId, reminderName:ev.name, description:ev.description, date:ev.date},
          'http://reminders:8080/api/add-reminder/', token, 'POST'
        );
      }
    }
  });
};

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
    userReminders.calendarName = userReminders.name;
    httpResponse(res, userReminders);
  } catch (err) { console.log(err); res.status(500).send(); }
});

apiRouter.get('/refresh/', async (req, res) => {
  console.log('Got hit: refresh');
  try {
    const userId = await getUserId(client, req.get('Authorization'));
    if (!userId) {
      console.log('Verification failed!');
      res.status(500).send();
    }

    const cals = await manager.get_calendars(userId);

    var events = await Promise.all(cals.calendars.map(async (cal) => {
      console.log('Refreshing calendar:', cal.calendarUrl);
      const cal_events = await getAllCloseEvents(cal.calendarId, userId, cal.calendarUrl, cal.ttl, req.get('Authorization'))
      return cal_events;
    }));

    res.status(200).json({'ok': true});
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

    const result = await manager.add_calendar(req.body.name, req.body.url, req.body.ttl, userId);
    console.log('Successfully added calendar:', result);
    
    const userReminders = await manager.get_calendars(userId);
    console.log('Listing calendars:', userReminders);
    userReminders.calendarName = userReminders.name;
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
  
    
    req.body.ids.forEach(async (value) => {
      const result = await manager.delete_calendar(value, userId);
    });
    const userReminders = await manager.get_calendars(userId);
    console.log('Listing calendars:', userReminders);
    userReminders.calendarName = userReminders.name;
    httpResponse(res, userReminders);
  } catch { res.status(500).send(); }
});

export default apiRouter;
