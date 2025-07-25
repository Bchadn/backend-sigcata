// server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import buildingRoute from './routes/buildingRoute.js';
import ZNTRoute from './routes/ZNTRoute.js';
import PLRoute from './routes/PLRoute.js';
import batasadminRoute from './routes/batasadminRoute.js';
import intersectRoute from './routes/intersectRoute.js';
import zonaawalRoute from './routes/zonaawal2025Route.js';
import sampelzntRoute from './routes/sampelznt2025Route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8081;

app.use(cors({
  origin: 'http://localhost:5173', // frontend (React/Vite)
  credentials: true
}));

app.use(express.json());

// Static files (e.g. for Cesium tileset)
app.use('/tileset', express.static(path.join(__dirname, 'tilesets')));

// API endpoints
app.use('/cityjson', buildingRoute);
app.use('/znt', ZNTRoute);
app.use('/pl', PLRoute);
app.use('/batasadmin', batasadminRoute);
app.use('/intersect-data', intersectRoute);
app.use('/zonaawal', zonaawalRoute);
app.use('/sampelznt', sampelzntRoute);

app.listen(PORT, () => {
  console.log('Running on http://localhost:8081');
});