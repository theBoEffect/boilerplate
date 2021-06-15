import express from 'express';
import log from '../api/logging/api';
import m from '../middleware';
const router = express.Router();

router.get('/version', m.version);
router.get('/health', m.health);

// Log and Health
router.get('/logs', log.getLogs);
router.get('/logs/:id', log.getLog);
router.post('/logs', [m.schemaCheck], log.writeLog);
router.patch('/logs/:id', [m.schemaCheck], log.patchLog); //For Example Only

module.exports = router;
