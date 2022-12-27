/* eslint-disable react/prop-types */
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import AdbIcon from '@mui/icons-material/Adb';
import Typography from '@mui/material/Typography';

export default function ButtonAppBar({ token }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <AdbIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              ForgetMeNot
            </Typography>
          </Box>
          <Box>
            {!token ? (
              <>
                <Button color="inherit" href="/signup">Sign Up</Button>
                <Button color="inherit" href="/signin">Sign in</Button>
              </>
            )
              : (
                <>
                  <Button color="inherit" href="/calendars">Calendars</Button>
                  <Button color="inherit" href="/reminders">Reminders</Button>
                  <Button color="inherit" href="/logout">Sign out</Button>
                </>
              )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
