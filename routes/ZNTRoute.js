// routes/ZNTRoute.js
import express from 'express';
import { getZNT } from '../controllers/ZNTController.js';

const router = express.Router();

// Rute dinamis untuk ZNT berdasarkan tahun, contoh: /znt/2019, /znt/2021, /znt/2025
router.get('/:year', getZNT);

export default router;