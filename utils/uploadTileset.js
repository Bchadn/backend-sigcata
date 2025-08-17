// utils/uploadTileset.js
import fs from 'fs';
import path from 'path';
import db from '../config/Database.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path ke folder tilesets
const tilesetsRoot = path.join(__dirname, '..', 'tilesets');

async function uploadAllTilesets() {
  const folders = fs.readdirSync(tilesetsRoot).filter(folder => {
    const jsonPath = path.join(tilesetsRoot, folder, 'tileset.json');
    return fs.existsSync(jsonPath);
  });

  console.log(`🟡 Ditemukan ${folders.length} folder tileset`);

  for (const folderName of folders) {
    const tilesetPath = path.join(tilesetsRoot, folderName, 'tileset.json');
    const basePath = `/tiles/${folderName}/`;

    try {
      const jsonData = fs.readFileSync(tilesetPath, 'utf-8');
      const parsedJson = JSON.parse(jsonData);

      const result = await db.query(
        `INSERT INTO public.tileset_metadata (name, tileset_json, base_path)
         VALUES ($1, $2, $3)
         ON CONFLICT (name)
         DO UPDATE SET tileset_json = EXCLUDED.tileset_json,
                       base_path = EXCLUDED.base_path
         RETURNING id`,
        [folderName, parsedJson, basePath]
      );

      console.log(`✅ ${folderName} berhasil diupload (ID: ${result.rows[0].id})`);
    } catch (err) {
      console.error(`❌ Gagal upload ${folderName}: ${err.message}`);
    }
  }

  await db.end();
  console.log('✅ Semua koneksi ditutup. Selesai.');
}

uploadAllTilesets();
