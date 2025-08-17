// routes/PLRoute.js
import express from 'express';
import { getPL } from '../controllers/PLController.js';

const router = express.Router();

router.get('/:year', getPL);

export default router;