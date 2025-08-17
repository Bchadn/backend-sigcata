// src/backend/routes/intersectRoute.js
import express from 'express';
import { getIntersectedData } from '../controllers/IntersectController.js';

const router = express.Router();

router.post('/', getIntersectedData);

export default router;