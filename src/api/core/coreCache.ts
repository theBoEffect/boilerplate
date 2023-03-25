import NodeCache from 'node-cache';
import { Core } from '../../types';
import helper from '../../helper';

const myCache = new NodeCache();

async function cacheThis(key: string, data: string, ttl: number = 3600) {
	return myCache.set(key, data, ttl);
}

export default {
	async cacheToken(AG: string, token: string): Promise<boolean> {
		return cacheThis(`service-cc-${AG}`, token, 1200);
	},
	async getToken(AG: string): Promise<string|undefined> {
		return myCache.get(`service-cc-${AG}`);
	},
	async killToken(AG: string): Promise<number> {
		return myCache.del(`service-cc-${AG}`);
	},
	async cacheGroupInfo(groupId: string, info: object | string): Promise<boolean>{
		const data: string|undefined = prepJsonCache(info);
		return cacheThis(groupId, <string>data, 43200);
	},
	async getGroupInfo(groupId: string): Promise<object|undefined> {
		try {
			const info: string|undefined = await myCache.get(groupId);
			return parseJsonCache(info);
		} catch (e) {
			return undefined;
		}
	},
	async clearGroupInfo(groupId: string): Promise<number> {
		return myCache.del(groupId);
	},
	async cacheUser(token: string, user: object): Promise<boolean> {
		const data = prepJsonCache(user);
		return cacheThis(token, <string>data, 300);
	},
	async getUser(token: string): Promise<object|undefined> {
		try {
			const user: string|undefined = await myCache.get(token);
			return parseJsonCache(user);
		} catch (e) {
			return undefined;
		}
	},
	async clearUser(token: string): Promise<number> {
		return myCache.del(token);
	},
	async cacheIntrospection(token: string, decoded: Core.Decoded) {
		const data: string|undefined = prepJsonCache(decoded);
		return cacheThis(`inspect-${token}`, <string>data, 300);
	},
	async getIntrospection(token: string): Promise<object|undefined> {
		try {
			const decoded: string|undefined = await myCache.get(`inspect-${token}`);
			return parseJsonCache(decoded);
		} catch (e) {
			return undefined;
		}
	},
	async clearIntrospection(token: string): Promise<number> {
		return myCache.del(`inspect-${token}`);
	},
};

function prepJsonCache(data: object | string | undefined): string | undefined {
	if(typeof data === 'object'){
		return JSON.stringify(data);
	}
	return data;
}

function parseJsonCache(data: object|string|undefined): object|undefined {
	if(helper.isJson(<string>data)){
		return JSON.parse(<string>data);
	}
	if(helper.isJson(JSON.stringify(data))){
		return <object>data;
	}
	return undefined;
}