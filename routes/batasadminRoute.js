import express from 'express';
import { getbatasadmin } from '../controllers/batasadmin.js';

const router = express.Router();

router.get('/', getbatasadmin);

export default router;
