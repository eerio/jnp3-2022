/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { addCalendar } from './api_calls';

export default function AddCalendar({ reFetch }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const toStringify = Object.fromEntries(data.entries());

    setLoading(true);
    addCalendar(toStringify).then(() => {
      reFetch();
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <Container
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      { loading ? <CircularProgress />
        : (
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  autoComplete="url"
                  name="url"
                  required
                  fullWidth
                  id="url"
                  label="url"
                  autoFocus
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  inputProps={{ inputMode: 'numeric' }}
                  required
                  fullWidth
                  id="ttl"
                  label="Time before reminding"
                  name="ttl"
                />
              </Grid>
            </Grid>
            <Button
              color="success"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add new calendar
              {' '}
              <AddIcon />
            </Button>
          </Box>
        )}
    </Container>
  );
}
