import express from "express";
import Root from './root.js';
import Log from '../api/logging/routes.js';
const router = express.Router();

// Add all routes here...
router.use(Root);
router.use('/api', Log);

export default router;
