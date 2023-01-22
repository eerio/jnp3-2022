const REDIS_EXPIRE = 600;

const makeApiCall = (data, url, token, mthd = 'GET') => fetch(url, {
  method: mthd,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: token,
  },
  body: JSON.stringify(data),
}).then((res) => res.json());

const getUserId = async (redisClient, token) => {
  const cachedId = await redisClient.get(token);

  if (!cachedId) {
    const res = await makeApiCall(undefined, `http://users:8080/api/user_id/`, token);
    const { userId } = res;

    redisClient.setex(token, REDIS_EXPIRE, userId);

    return userId;
  }
  return cachedId;
};

export default getUserId;
