/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function CardData({ name = 'name', date = 'date', description = 'description' }) {
  return (
    <CardContent>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        Upcoming event!
      </Typography>
      <Typography variant="h5" component="div">
        {name}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {date}
      </Typography>
      <Typography variant="body2">
        {description}
      </Typography>
    </CardContent>
  );
}

export default function ReminderCard(props) {
  return (
    <Box sx={{ minWidth: 275, maxWidth: 400 }}>
      <Card variant="outlined">
        <CardData {...props} />
      </Card>
    </Box>
  );
}
