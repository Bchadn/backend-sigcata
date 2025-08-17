// routes/buildingRoute.js
import express from 'express';
import { getAllTilesets, getTilesetById } from '../controllers/building3d.js';

const router = express.Router();

router.get('/', getAllTilesets);
router.get('/:id', getTilesetById);

export default router;
