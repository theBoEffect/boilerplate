import NodeCache from 'node-cache';
import helper from '../../helper';

const myCache = new NodeCache();

async function cacheThis(key, data, ttl = 3600) {
	return myCache.set(key, data, ttl);
}

export default {
	async cacheToken(AG, token) {
		return cacheThis(`service-cc-${AG}`, token, 1200);
	},
	async getToken(AG) {
		return myCache.get(`service-cc-${AG}`);
	},
	async killToken(AG) {
		return myCache.del(`service-cc-${AG}`);
	},
	async cacheGroupInfo(groupId, info) {
		const data = prepJsonCache(info);
		return cacheThis(groupId, data, 43200);
	},
	async getGroupInfo(groupId) {
		try {
			const info = await myCache.get(groupId);
			return parseJsonCache(info);
		} catch (e) {
			return undefined;
		}
	},
	async clearGroupInfo(groupId) {
		return myCache.del(groupId);
	},
	async cacheUser(token, user) {
		const data = prepJsonCache(user);
		return cacheThis(token, data, 300);
	},
	async getUser(token) {
		try {
			const user = await myCache.get(token);
			return parseJsonCache(user);
		} catch (e) {
			return undefined;
		}
	},
	async clearUser(token) {
		return myCache.del(token);
	},
	async cacheIntrospection(token, decoded) {
		const data = prepJsonCache(decoded);
		return cacheThis(`inspect-${token}`, data, 300);
	},
	async getIntrospection(token) {
		try {
			const decoded = await myCache.get(`inspect-${token}`);
			return parseJsonCache(decoded);
		} catch (e) {
			return undefined;
		}
	},
	async clearIntrospection(token) {
		return myCache.del(`inspect-${token}`);
	},
};

function prepJsonCache(data) {
	if(typeof data === 'object'){
		return JSON.stringify(data);
	}
	return data;
}

function parseJsonCache(data) {
	if(helper.isJson(data)){
		return JSON.parse(data);
	}
	if(helper.isJson(JSON.stringify(data))){
		return data;
	}
	return undefined;
}