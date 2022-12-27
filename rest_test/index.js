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

app.post('/api/register/',(req, res) => {
    if (req.body.firstName === 'Adam') {
        res.status(200).json({});
    } else {
        res.status(400).json({err: ['Wrong name byatch']});
    }
});

app.post('/api/login/',(req, res) => {
    console.log('got hit login');
    if (req.body.email === 'goodemail') {
        res.status(200).json({token: `${req.body.password}`});
    } else {
        res.status(400).json({err: ['Wrong email byatch']});
    }
});

app.get('/api/user_id/',(req, res) => {
    console.log('got hit user_id');
    res.json({userId: Number(req.get('Authorization'))});
});

app.get('/api/calendars/',(req, res) => {
    res.status(200).json({calendars: ex_calendars});
});


// Listen
app.listen(PORT, () => {
  console.log(`Reminders app listening on port ${PORT}`);
});
