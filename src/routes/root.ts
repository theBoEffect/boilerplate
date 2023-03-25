import express from 'express';
import api from '../api/openapi/api';
import m from "../middleware";

const router = express.Router();

router.get('/', api.serveVersion);
router.get('/api', api.reDocApi);
router.get('/swagger', api.serveSwaggerUI);
router.get('/swagger.json', api.serveApiJson);
router.get('/oauth2-redirect.html', api.oauth2Redirect);
router.get('/api/version', m.version);
router.get('/api/health', m.health);

export default router;
