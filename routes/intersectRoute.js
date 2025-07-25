// src/backend/routes/intersectRoute.js
import express from 'express';
import { getIntersectedData } from '../controllers/IntersectController.js';

const router = express.Router();

// Karena ini adalah POST request dari frontend, kita menggunakan router.post
router.post('/', getIntersectedData);

export default router;