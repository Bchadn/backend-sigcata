// routes/ZNTRoute.js
import express from 'express';
import { getZNT } from '../controllers/ZNTController.js';

const router = express.Router();

router.get('/:year', getZNT);

export default router;