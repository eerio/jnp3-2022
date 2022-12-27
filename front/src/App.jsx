import React from 'react';
import { Routes, Route } from 'react-router-dom';

import SignIn from './routes/SignIn';
import SignUp from './routes/SignUp';
import Calendars from './routes/Calendars';
import useToken from './hooks/useToken';
import Reminders from './routes/Reminders';
import getToken from './utils/get_token';
import SignOut from './routes/SignOut';
import ButtonAppBar from './utils/AppBar';

function App() {
  const [token, setToken] = useToken(getToken());

  return (
    <>
      <ButtonAppBar token={token} />
      {
    token
      ? (
        <Routes>
          <Route path="/calendars" element={<Calendars />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/logout" element={<SignOut setToken={setToken} />} />
        </Routes>
      )
      : (
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<SignIn setToken={setToken} />} />
        </Routes>
      )
      }
    </>
  );
}

export default App;
