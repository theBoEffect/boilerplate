import express from 'express';
import api from './api.js';
import m from '../../middleware.js';
const router = express.Router();

// update this for your preferred resource path naming
const PATH = 'logs'

// simple non-auth endpoints
router.get(`/${PATH}`, api.get);

// example authentication but no authorization (permissions) against your Core EOS Platform instance
router.get(`/${PATH}/:id`, [
    m.isAnyAuth
], api.getOne);

// example using middleware to authenticate and authorize against your Core EOS Platform instance
router.post(`/${PATH}`, [
    m.schemaCheck,
    //m.isAuthenticated,
    //m.enforce
], api.write);

// example like above but now this can authenticate and authorize against any Core EOS Platform - not generally recommended
router.patch(`/:group/${PATH}/:id`, [
    m.schemaCheck,
    m.isAuthenticated,
    m.validateAG,
    m.getOrgContext,
    m.enforce
], api.patch);

export default router;
