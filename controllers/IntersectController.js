// src/backend/controllers/IntersectController.js
import db from '../config/Database.js';

export const getIntersectedData = async (req, res) => {
    const { dataTypeZNT, dataTypePenggunaanLahan, yearZNT, yearPenggunaanLahan, fungsiLahan, minHarga, maxHarga } = req.body;

    // Validasi input
    if (!dataTypeZNT || !dataTypePenggunaanLahan) {
        return res.status(400).json({ error: 'Interseksi memerlukan pemilihan Jenis Data Zona Nilai Tanah dan Penggunaan Lahan.' });
    }
    if (!yearZNT || !yearPenggunaanLahan) {
        return res.status(400).json({ error: 'Harap pilih tahun data untuk Zona Nilai Tanah dan Penggunaan Lahan.' });
    }
    if (!fungsiLahan || fungsiLahan.length === 0) {
        // Opsional: Anda bisa membuat ini tidak wajib jika ingin memungkinkan interseksi tanpa fungsi lahan
        return res.status(400).json({ error: 'Harap pilih setidaknya satu Fungsi Lahan.' });
    }

    const tableNamePL = `PenggunaanLahan${yearPenggunaanLahan}`;
    const tableNameZNT = `ZonaNilaiTanah${yearZNT}`;

    // Bangun klausa WHERE secara dinamis untuk fungsi lahan
    let plWhereClause = '';
    if (fungsiLahan && fungsiLahan.length > 0) {
        // Memformat daftar fungsi lahan untuk query SQL
        const formattedFungsi = fungsiLahan.map(f => `'${f.replace(/'/g, "''")}'`).join(', ');
        plWhereClause = `AND pl.namobj IN (${formattedFungsi})`;
    }

    // Bangun klausa WHERE secara dinamis untuk harga ZNT
    let zntWhereClause = '';
    if (minHarga !== null && maxHarga !== null) {
        zntWhereClause = `AND znt.harga >= ${parseFloat(minHarga)} AND znt.harga <= ${parseFloat(maxHarga)}`;
    } else if (minHarga !== null) {
        zntWhereClause = `AND znt.harga >= ${parseFloat(minHarga)}`;
    } else if (maxHarga !== null) {
        zntWhereClause = `AND znt.harga <= ${parseFloat(maxHarga)}`;
    }

    // Query SQL untuk interseksi
    const query = `
    SELECT json_build_object(
      'type', 'FeatureCollection',
      'features', json_agg(
        json_build_object(
          'type', 'Feature',
          'geometry', ST_AsGeoJSON(ST_Transform(ST_Intersection(pl.geom, znt.geom), 4326))::json,
          'properties', json_build_object(
            'id_pl', pl.id_pl,
            'fungsi', pl.namobj,
            'id_zona', znt.id_zona,
            'no_zona', znt.no_zona,
            'harga', znt.harga
          )
        )
      )
    ) AS geojson
    FROM
        "${tableNamePL}" pl,
        "${tableNameZNT}" znt
    WHERE
        ST_Intersects(pl.geom, znt.geom)
        ${plWhereClause}
        ${zntWhereClause};
  `;

    console.log("Executing Intersection Query:", query);

    try {
        const result = await db.query(query);

        // Pastikan result.rows[0].geojson tidak null atau undefined
        if (result.rows.length > 0 && result.rows[0].geojson) {
            res.json(result.rows[0].geojson);
        } else {
            // Jika tidak ada hasil interseksi, kembalikan FeatureCollection kosong
            res.json({ type: 'FeatureCollection', features: [] });
        }

    } catch (err) {
        console.error('Error executing intersection query:', err);
        res.status(500).json({ message: 'Gagal melakukan pencarian interseksi: ' + err.message });
    }
};
