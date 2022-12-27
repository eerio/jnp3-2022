/* eslint-disable react/jsx-props-no-spreading */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignOut({ setToken }) {
  const navigate = useNavigate();
  useEffect(() => {
    sessionStorage.removeItem('token');
    setToken('');
    navigate('/');
  }, []);
}
