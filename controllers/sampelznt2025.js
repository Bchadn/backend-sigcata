import db from '../config/Database.js';

export const getsampelznt = async (req, res) => {
  try {
    const result = await db.query(`
              SELECT json_build_object(
              'type', 'FeatureCollection',
              'features', json_agg(
              json_build_object(
              'type', 'Feature',
              'geometry', ST_AsGeoJSON(ST_Transform(geom, 4326))::json, 
              'properties', json_build_object(
              'No Zona', no_zona,
              'Keterangan', keterangan,
              'Koordinat X', x,
              'Koordinat Y', y,
              'Harga per m2', harga_per_m2
            )
          )
        )
      ) AS geojson
      FROM "SampelZonaNilaiTanah2025";
    `);

    res.json(result.rows[0].geojson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};