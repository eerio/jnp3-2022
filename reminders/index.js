import express, { json } from 'express';
import cors from 'cors';
import apiRouter from './api/reminders.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(json());

app.use(async (req, res, next) => {
  if (req.get('Authorization')) { console.log('authorized'); next(); } else { res.status(403).send(); }
});

app.use('/api', apiRouter);

// Listen
app.listen(PORT, () => {
  console.log(`Reminders app listening on port ${PORT}`);
});
