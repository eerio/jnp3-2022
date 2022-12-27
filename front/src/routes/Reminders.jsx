/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';
import ReminderCard from '../utils/ReminderCard';
import { fetchReminders } from '../utils/api_calls';

export default function Reminders() {
  const [reminders, setReminders] = useState([]);

  const fetchData = () => fetchReminders().then((res) => setReminders(res.reminders));

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Grid container component="main" spacing={2} sx={{ mt: 2 }}>
      {reminders.map((reminder) => (
        <Grid item xs={3}>
          <ReminderCard {...reminder} />
        </Grid>
      ))}
    </Grid>
  );
}
