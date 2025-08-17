// controllers/PLController.js
import db from '../config/Database.js';

export const getPL = async (req, res) => {
  const { year } = req.params;

  let tableName;
  switch (year) {
    case '2019':
      tableName = 'PenggunaanLahan2019';
      break;
    case '2021':
      tableName = 'PenggunaanLahan2021';
      break;
    case '2025':
      tableName = 'PenggunaanLahan2025';
      break;
    default:
      return res.status(400).json({ message: 'Tahun Penggunaan Lahan tidak valid.' });
  }

  try {
    const result = await db.query(`
      SELECT json_build_object(
        'type', 'FeatureCollection',
        'features', json_agg(
          json_build_object(
            'type', 'Feature',
            'geometry', ST_AsGeoJSON(ST_Transform(geom, 4326))::json,
            'properties', json_build_object(
              'ID Penggunaan Lahan', id_pl,
              'Fungsi Lahan', namobj,
              'Kategori', landuse
            )
          )
        )
      ) AS geojson
      FROM "${tableName}";
    `);

    if (result.rows.length === 0 || !result.rows[0].geojson) {
      return res.json({
        type: 'FeatureCollection',
        features: []
      });
    }

    res.json(result.rows[0].geojson);
  } catch (err) {
    console.error(`Error fetching Penggunaan Lahan ${year}:`, err);
    res.status(500).json({ message: err.message });
  }
};