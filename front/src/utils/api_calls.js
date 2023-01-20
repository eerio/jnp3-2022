import getToken from './get_token';

const makeAPiCall = (data, url, mthd = 'GET') => fetch(url, {
  method: mthd,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: getToken()?.token,
  },
  body: JSON.stringify(data),
}).then((res) => res.json());

/*
 body:
 {
  firstName: str,
  lastName: str,
  email: str,
  password: str,
 }

 return:
 on error has field {err: [str]}

 */
const register = (data) => makeAPiCall(data, `${process.env.REACT_APP_USERS_URL}/api/register`, 'POST');

/*
 body:
{
  email: str,
  password: str,
}
 return:
 on success has field {token: str}, on error {err: [str]}
 */
const authenticate = (data) => makeAPiCall(data, `${process.env.REACT_APP_USERS_URL}/api/login`, 'POST');

const logout = (data) => makeAPiCall(data, `${process.env.REACT_APP_USERS_URL}/api/logout`, 'POST');
/*
body (HAS HEADER AUTHENTICATE=TOKEN):
blank
return:
 {
  calendars: [calendar]
}
where calendar is
{
  id: num,
  url: string,
  calendarName: string,
  ttl: num,
}
*/
const fetchCalendars = (data) => makeAPiCall(data, `${process.env.REACT_APP_CALENDARS_URL}/api/calendars`, 'GET');

/*
body (has header AUTHORIZATION=TOKEN):
{
  calendarName: str,
  url: str,
  ttl: num,
}
return:
whatevs, but return sth
*/
const addCalendar = (data) => makeAPiCall(data, `${process.env.REACT_APP_CALENDARS_URL}/add-calendar`, 'POST');

/*
body (has header AUTHORIZATION=TOKEN):
{
  ids: [num]
}
return:
just return anything
*/
const deleteCalendars = (data) => makeAPiCall(data, `${process.env.REACT_APP_CALENDARS_URL}/delete-calendar`, 'POST');

/*
body has header =||=:
blank
return:
 {
  reminders: [reminder]
}
where reminder is
{
  id: num,
  reminderName: string,
  desccription: string,
  date: num,
}
*/
const fetchReminders = (data) => makeAPiCall(data, `${process.env.REACT_APP_REMINDERS_URL}/api/list-reminders`, 'GET');

export {
  register, authenticate, fetchCalendars, addCalendar, deleteCalendars, fetchReminders,
};
