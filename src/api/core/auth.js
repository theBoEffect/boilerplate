/**
 * Implementation assumes a PKCE UE Core accessed token from users
 * and client-secret-jwt for oauth
 */
import jwt from 'jsonwebtoken';
import qs from 'querystring';
import jkwsClient from 'jwks-rsa';
import axios from 'axios';
import Boom from '@hapi/boom';
import cache from './coreCache';

const config = require('../../config');
const AUDIENCE = `${config.PROTOCOL}://${config.SWAGGER}`;

const jwtCheck = /^([A-Za-z0-9\-_~+\/]+[=]{0,2})\.([A-Za-z0-9\-_~+\/]+[=]{0,2})(?:\.([A-Za-z0-9\-_~+\/]+[=]{0,2}))?$/;

function isJWT(str) {
	return jwtCheck.test(str);
}

async function getUser(token, issuer) {
	const user = await cache.getUser(token);
	if(user) return user;
	const url = `${issuer}/me`;
	const options = {
		url,
		method: 'get',
		headers: {
			authorization: `bearer ${token}`
		}
	};
	const result = await axios(options);
	if(result?.data){
		await cache.cacheUser(token, result.data);
	}
	return result.data;
}

async function getAGInfo(authGroup, token) {
	const info = await cache.getGroupInfo(authGroup);
	if(info) return info;
	const options = {
		url: `${config.CORE_EOS_ISSUER}/api/group-info/${authGroup}`,
		method: 'get'
	};
	if(token) {
		options.headers = {
			authorization: `bearer ${token}`
		};
	}
	const result = await axios(options);
	if(!result?.data?.data) throw Boom.unauthorized();
	if(result?.data?.data?.core) {
		await cache.cacheGroupInfo(authGroup, result.data.data);
	}
	return result.data.data;
}

async function introspect(token, issuer, client_id) {
	const intro = await cache.getIntrospection(token);
	if(intro) {
		if (intro?.exp > Date.now() / 10000) return intro;
		else await cache.clearIntrospection(token);
	}
	const introspection = `${issuer}/token/introspection`;
	const options = {
		url: introspection,
		method: 'post',
		data: qs.stringify({
			token,
			client_id,
			'token-hint': 'access_token',
		})
	};
	const result = await axios(options);
	if(result?.data) {
		await cache.cacheIntrospection(token, result.data);
	}
	return result.data;
}

async function runDecodedChecks(token, issuer, decoded, authGroup, clientId, requireAud = false) {
	// first validate correct UE Core ISS domain
	const issHost = issuer.replace('http://', '').replace('https://','').split('/');
	if(issHost[0] !== config.CORE_EOS_ISSUER.replace('https://','')) {
		throw new Error('Unexpected host domain for Core EOS');
	}
	if(decoded.nonce) {
		throw new Error('ID Tokens can not be used for API Access');
	}
	if(decoded.iss !== issuer) {
		throw new Error('Token issuer not recognized');
	}
	if(!decoded.group) {
		throw new Error('No Auth Group detected in token');
	}
	if(decoded.group !== authGroup && decoded.group !== config.CORE_EOS_PLATFORM_ID) {
		throw new Error('Auth Group does not match');
	}

	if(requireAud === true) {
		if(!decoded.aud) throw new Error(`Audience (aud) is required: ${AUDIENCE}/api/${authGroup}`);
	}

	if(typeof decoded.aud === 'string') {
		if(decoded.aud !== `${AUDIENCE}/api/${authGroup}`) {
			throw new Error('Token audience is not valid');
		}
	}
	if(Array.isArray(decoded.aud)) {
		if(!decoded.aud.includes(`${AUDIENCE}/api/${authGroup}`)) {
			throw new Error('Token audience is not valid');
		}
	}
	if (decoded.client_id) {
		if(decoded.client_id !== clientId) {
			throw new Error('Unexpected Client ID');
		}
	}

	//check sub if present
	if(decoded.sub && decoded.client_id !== decoded.sub) {
		let user;
		if(decoded.email) {
			user = {
				sub: decoded.sub,
				email: decoded.email
			};
		} else {
			user = await getUser(token, issuer);
		}
		if(!user) {
			await cache.clearUser(token);
			throw new Error('Token should include email');
		}
		return { ...user, decoded };
	}
	// client_credential - note, permissions may still stop the request
	if((decoded.client_id === decoded.sub) || (!decoded.sub && decoded.client_id)) {
		const out = {
			client_credential: true,
			sub: decoded.client_id,
			client_id: decoded.client_id
		};
		return { ...out, decoded };
	}

	return decoded;
}

function oidcValidate (CC = false, platformOverride = false) {
	return async function (req, token, next) {
		try {
			let authGroup, clientId, issuer, agData;
			if (isJWT(token)) {
				const preDecoded = jwt.decode(token, {complete: true});
				if (!preDecoded?.payload?.group) return next(null, false);
				if (!preDecoded?.payload?.iss) return next(null, false);
				authGroup = req.params.group || preDecoded?.payload?.group;
				issuer = preDecoded?.payload?.iss;
				if (CC === true) {
					agData = await getAGInfo(authGroup);
					clientId = config.CORE_THIS_SERVICE_CLIENT_ID;
				} else if (platformOverride === true){
					agData = await getAGInfo(config.CORE_EOS_PLATFORM_ID, token);
					clientId = agData?.id;
				} else {
					agData = await getAGInfo(authGroup, token);
					clientId = agData?.id;
				}
				if (!clientId) {
					await cache.clearGroupInfo(authGroup);
					return next(null, false);
				}
				if(!platformOverride) req.group = agData;
				if (authGroup !== agData.groupId) {
					authGroup = agData.groupId;
				}
				const client = jkwsClient({
					jwksUri: `${issuer}/jwks`
				});

				const key = await client.getSigningKey(preDecoded.header.kid);
				const signingKey = key.getPublicKey || key.rsaPublicKey;

				const decoded = await jwt.verify(token, signingKey());
				if (decoded) {
					const result = await runDecodedChecks(token, issuer, decoded, authGroup, clientId, CC);
					return next(null, result, {token, ...decoded});
				}
			}
			//opaque token
			if (!req.params.group) {
				//if there is no group param, assume the context is your own core eos platform instance
				authGroup = config.CORE_EOS_PLATFORM_ID;
			} else authGroup = req.params.group;
			if (CC === true) {
				agData = await getAGInfo(authGroup);
				clientId = config.CORE_THIS_SERVICE_CLIENT_ID;
			} else if (platformOverride === true){
				agData = await getAGInfo(config.CORE_EOS_PLATFORM_ID, token);
				clientId = agData?.id;
			} else {
				agData = await getAGInfo(authGroup, token);
				clientId = agData?.id;
			}

			if (!clientId) {
				await cache.clearGroupInfo(authGroup);
				return next(null, false);
			}
			if(!platformOverride) req.group = agData;
			if (authGroup !== agData.groupId) {
				authGroup = agData.groupId;
			}
			issuer = `${config.CORE_EOS_ISSUER}/${authGroup}`;
			const inspect = await introspect(token, issuer, clientId);
			if (inspect) {
				if (inspect.active === false) {
					await cache.clearIntrospection(token);
					return next(null, false);
				}
				const result = await runDecodedChecks(token, issuer, inspect, authGroup, clientId, CC);
				return next(null, result, {token, ...inspect});
			}
			return next(null, false);
		} catch (error) {
			if (error.isAxiosError) {
				console.info('UNAUTHORIZED VIA API CORE - IF YOU HAVE CHAINED AUTHENTICATION, THIS MAY NOT MATTER');
				//console.info(error?.response?.status);
				//console.error(error?.response?.data);
			}
			else console.error(error);
			return next(null, false);
		}
	};
}

export default {
	coreIntrospection: introspect,
	coreChecks: runDecodedChecks,
	coreOIDC: oidcValidate(false),
	coreCC: oidcValidate(true),
	corePlatform: oidcValidate(false, true),
};