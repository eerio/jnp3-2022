import { useState } from 'react';
import getToken from '../utils/get_token';

export default function useToken() {
  const [token, setToken] = useState(getToken());

  const saveToken = (userToken) => {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
  };

  return [
    token,
    saveToken,
  ];
}
