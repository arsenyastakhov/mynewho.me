import { createClient } from '@supabase/supabase-js';
import { properties as seedProperties } from '../../src/data/properties.js';

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(body),
});

const getClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase environment variables are missing.');
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

const mapRowsToProperties = (rows = []) =>
  rows
    .map((row) => ({
      id: row.id,
      ...(row.data || {}),
    }))
    .sort((a, b) => a.address.localeCompare(b.address));

const seedRows = seedProperties.map((property) => ({
  id: property.id,
  data: property,
}));

const getAdminPassword = () => process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || '';

const isAuthorized = (event) => {
  const incomingPassword = event.headers['x-admin-password'] || event.headers['X-Admin-Password'] || '';
  return Boolean(incomingPassword) && incomingPassword === getAdminPassword();
};

const fetchAllRows = async (client) => {
  const { data, error } = await client.from('properties').select('id, data');

  if (error) {
    throw error;
  }

  return data || [];
};

const ensureSeeded = async (client) => {
  const rows = await fetchAllRows(client);

  if (rows.length > 0) {
    return rows;
  }

  const { error } = await client.from('properties').upsert(seedRows);

  if (error) {
    throw error;
  }

  return fetchAllRows(client);
};

export const handler = async (event) => {
  let client;

  try {
    client = getClient();
  } catch (error) {
    return json(500, { error: error.message });
  }

  try {
    if (event.httpMethod === 'GET') {
      const rows = await ensureSeeded(client);
      return json(200, { properties: mapRowsToProperties(rows) });
    }

    if (!isAuthorized(event)) {
      return json(401, { error: 'Unauthorized.' });
    }

    const payload = event.body ? JSON.parse(event.body) : {};

    if (event.httpMethod === 'POST') {
      const property = payload.property || {};
      const id = property.id || `prop-${crypto.randomUUID()}`;
      const nextProperty = { ...property, id };

      const { error } = await client.from('properties').upsert({
        id,
        data: nextProperty,
      });

      if (error) {
        throw error;
      }

      return json(200, { property: nextProperty });
    }

    if (event.httpMethod === 'PUT') {
      const id = payload.id;
      const property = payload.property || {};

      if (!id) {
        return json(400, { error: 'Property id is required.' });
      }

      const nextProperty = { ...property, id };
      const { error } = await client.from('properties').upsert({
        id,
        data: nextProperty,
      });

      if (error) {
        throw error;
      }

      return json(200, { property: nextProperty });
    }

    if (event.httpMethod === 'DELETE') {
      const id = payload.id;

      if (!id) {
        return json(400, { error: 'Property id is required.' });
      }

      const { error } = await client.from('properties').delete().eq('id', id);

      if (error) {
        throw error;
      }

      return json(200, { ok: true });
    }

    return json(405, { error: 'Method not allowed.' });
  } catch (error) {
    return json(500, { error: error.message || 'Unexpected server error.' });
  }
};
