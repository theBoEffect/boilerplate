import axios from 'axios';
import qs from 'querystring';
import cache from '../core/coreCache';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import Boom from "@hapi/boom";
const config = require('../../config');
const CLIENT_ASSERTION_TYPE = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer';

// creates a client secret jwt for secure m2m client authorization
async function getSecretJwt(aud, minutes = 1) {
	const clientSecret = config.CORE_THIS_SERVICE_CLIENT_SECRET;
	const clientId = config.CORE_THIS_SERVICE_CLIENT_ID;

	const claims = {
		iat: Math.floor(Date.now() / 1000),
		exp: Math.floor(Date.now()/1000 + (minutes*60)),
		iss: clientId,
		aud,
		sub: clientId,
		jti: uuid()
	};

	return jwt.sign(claims, clientSecret);
}

const capi = {
	async getOrgContext(req, res, next) {
		try {
			if(req.headers?.['x-org-context']) {
				req.orgContext = req.headers['x-org-context'];
				return next();
			}
			if(req.group?.core?.org?.id) {
				req.orgContext = req.group.core.org.id;
				return next();
			}
			if (req.authInfo?.group === config.CORE_EOS_PLATFORM_ID && req.authInfo?.client_credential !== true) return next();
			throw Boom.forbidden('Can not validate an organization to check permissions');
		} catch (error) {
			next(error);
		}
	},
	async validateAG(req, res, next) {
		try {
			if(!req.group) {
				let group;
				if(!req.params.group) {
					group = config.CORE_EOS_PLATFORM_ID;
				} else group = req.params.group;
				const url = `${config.CORE_EOS_ISSUER}/api/group-info/${group}`;
				let result;
				try {
					result = await axios.get(url);
				} catch (error) {
					throw Boom.notFound(`Unknown platform id: ${group}`);
				}
				if(!result?.data?.data) throw Boom.notFound(`Unknown platform id: ${group}`);
				req.group = result.data.data;
			}
			req.authGroup = req.group.groupId;
			req.OP = req.group.preferredOP;
			return next();
		} catch(error) {
			next(error);
		}
	},
	async getServiceCC(audience, refresh = false) {
		try {
			const authGroup = config.CORE_THIS_SERVICE_CC_AUTHORITY;
			let token = (refresh === false) ? await cache.getToken((audience) ? audience : authGroup) : undefined;
			if(!token) {
				const url = `${config.CORE_EOS_ISSUER}/${authGroup}/token`;
				const jwt = await getSecretJwt(url);
				const options = {
					method: 'post',
					url,
					headers: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: qs.stringify({
						grant_type: 'client_credentials',
						client_assertion_type: CLIENT_ASSERTION_TYPE,
						client_assertion: jwt,
						audience: `${config.CORE_EOS_ISSUER}/${authGroup}`,
						scope: 'access'
					})
				};
				const data = await axios(options);
				token = data?.data?.access_token;
				await cache.cacheToken((audience) ? audience : authGroup, token);
			}
			return token;
		} catch (error) {
			if(error.isAxiosError) console.error(error?.response?.data);
			else console.error(error);
			return undefined;
		}
	},
};

export default capi;