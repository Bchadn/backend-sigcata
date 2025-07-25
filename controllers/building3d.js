// controllers/building3d.js (ESM version)
import db from '../config/Database.js';

export const getAllTilesets = async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, base_path FROM public.tileset_metadata');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data tileset' });
  }
};

export const getTilesetById = async (req, res) => {
  try {
    const result = await db.query('SELECT tileset_json FROM public.tileset_metadata WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Tileset tidak ditemukan' });
    res.json(result.rows[0].tileset_json);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil detail tileset' });
  }
};
