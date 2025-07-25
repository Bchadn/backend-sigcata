import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Load dari .env

const { Pool } = pkg;

const db = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT),
  ssl: { rejectUnauthorized: false },
});

db.on('connect', async client => {
  try {
    await client.query('SET search_path TO extensions, public'); // untuk PostGIS & tabel umum
    console.log('✅ Terhubung ke Supabase PostgreSQL');
  } catch (err) {
    console.error('❌ Gagal set search_path:', err.message);
  }
});

db.on('error', err => {
  console.error('❌ Koneksi error:', err.message);
});

export default db;
