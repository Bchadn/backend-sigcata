import express from 'express';
import { getsampelznt } from '../controllers/sampelznt2025.js';

const router = express.Router();

router.get('/', getsampelznt);

export default router;
