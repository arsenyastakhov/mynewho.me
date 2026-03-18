const PROPERTIES_ENDPOINT = '/.netlify/functions/properties';
const ADMIN_AUTH_ENDPOINT = '/.netlify/functions/admin-auth';

const parseJsonSafely = async (response) => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const getStoredAdminPassword = () => sessionStorage.getItem('admin_password') || '';

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed.');
  }

  return data;
};

export const verifyAdminPassword = async (password) => {
  try {
    const data = await requestJson(ADMIN_AUTH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    return Boolean(data?.ok);
  } catch (error) {
    const localPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin';

    if (password === localPassword) {
      return true;
    }

    throw error;
  }
};

export const fetchPropertiesFromApi = async () => {
  const data = await requestJson(PROPERTIES_ENDPOINT);
  return Array.isArray(data?.properties) ? data.properties : [];
};

export const createPropertyViaApi = async (property) => {
  const data = await requestJson(PROPERTIES_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': getStoredAdminPassword(),
    },
    body: JSON.stringify({ property }),
  });

  return data.property;
};

export const updatePropertyViaApi = async (id, property) => {
  const data = await requestJson(PROPERTIES_ENDPOINT, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': getStoredAdminPassword(),
    },
    body: JSON.stringify({ id, property }),
  });

  return data.property;
};

export const deletePropertyViaApi = async (id) => {
  await requestJson(PROPERTIES_ENDPOINT, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': getStoredAdminPassword(),
    },
    body: JSON.stringify({ id }),
  });
};
