import express, { json } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(json());

const ex_calendars = [
    {
        id: 0,
        calendarName: "test0",
        url: "test0url",
        ttl: 3,
    },
    {
        id: 1,
        calendarName: "test0",
        url: "test0url",
        ttl: 3,
    },
    {
        id: 2,
        calendarName: "test0",
        url: "test0url",
        ttl: 3,
    }
]

app.get('/api/calendars/',(req, res) => {
    console.log('got hit calendars');
    res.status(200).json({calendars: ex_calendars});
});


// Listen
app.listen(PORT, () => {
  console.log(`Reminders app listening on port ${PORT}`);
});
