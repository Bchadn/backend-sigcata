// controllers/ZNTController.js
import db from '../config/Database.js';

export const getZNT = async (req, res) => {
  const { year } = req.params; // Mendapatkan tahun dari parameter URL

  let tableName;
  switch (year) {
    case '2019':
      tableName = 'ZonaNilaiTanah2019';
      break;
    case '2021':
      tableName = 'ZonaNilaiTanah2021';
      break;
    case '2025':
      tableName = 'ZonaNilaiTanah2025';
      break;
    default:
      return res.status(400).json({ message: 'Tahun ZNT tidak valid.' });
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
              'Nomor Zona', id_zona,
              'Harga', harga
            )
          )
        )
      ) AS geojson
      FROM "${tableName}";
    `);

    // Pastikan ada hasil sebelum mengakses rows[0]
    if (result.rows.length === 0 || !result.rows[0].geojson) {
      return res.json({
        type: 'FeatureCollection',
        features: []
      }); // Mengembalikan FeatureCollection kosong jika tidak ada data
    }

    res.json(result.rows[0].geojson);
  } catch (err) {
    console.error(`Error fetching ZNT ${year}:`, err); // Log error lebih spesifik
    res.status(500).json({ message: err.message });
  }
};