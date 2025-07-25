import express from 'express';
import { getzonaawal } from '../controllers/zonaawal2025.js';

const router = express.Router();

router.get('/', getzonaawal);

export default router;
