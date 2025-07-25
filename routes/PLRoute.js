// routes/PLRoute.js
import express from 'express';
import { getPL } from '../controllers/PLController.js';

const router = express.Router();

// Rute dinamis untuk Penggunaan Lahan berdasarkan tahun, contoh: /pl/2019, /pl/2021, /pl/2025
router.get('/:year', getPL);

export default router;