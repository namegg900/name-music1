import express from 'express';
import { proxyCatalogRequest } from '../controllers/catalogController.js';

const router = express.Router();

router.get('/*splat', proxyCatalogRequest);
router.get('/', proxyCatalogRequest);

export default router;
