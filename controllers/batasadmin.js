import db from '../config/Database.js';

export const getbatasadmin = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT json_build_object(
        'type', 'FeatureCollection',
        'features', json_agg(
          json_build_object(
            'type', 'Feature',
            'geometry', ST_AsGeoJSON(ST_Transform(geom, 4326))::json,
            'properties', json_build_object(
              'Desa', NAMOBJ,
              'Kecamatan', WADMKC,
              'Kabupaten', WADMKK,
              'Provinsi', WADMPR
            )
          )
        )
      ) AS geojson
      FROM "BatasAdministrasi";
    `);

    res.json(result.rows[0].geojson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};