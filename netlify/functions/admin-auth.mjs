const json = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(body),
});

const getAdminPassword = () => process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || '';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed.' });
  }

  const payload = event.body ? JSON.parse(event.body) : {};
  const password = payload.password || '';

  if (!password || password !== getAdminPassword()) {
    return json(401, { error: 'Incorrect password.' });
  }

  return json(200, { ok: true });
};
