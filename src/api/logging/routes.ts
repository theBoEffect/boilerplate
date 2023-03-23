import express from 'express';
import log from './api';
import m from '../../middleware';
const router = express.Router();

// simple non-auth endpoints
router.get('/logs', log.getLogs);

// example authentication but no authorization (permissions) against your Core EOS Platform instance
router.get('/logs/:id', [
    m.isAnyAuth
], log.getLog);

// example using middleware to authenticate and authorize against your Core EOS Platform instance
router.post('/logs', [
    m.schemaCheck,
    //m.isAuthenticated,
    //m.enforce
], log.writeLog);

// example like above but now this can authenticate and authorize against any Core EOS Platform - not generally recommended
router.patch('/:group/logs/:id', [
    m.schemaCheck,
    m.isAuthenticated,
    m.validateAG,
    m.getOrgContext,
    m.enforce
], log.patchLog);

export default router;
