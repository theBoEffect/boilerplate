import jsonPatch from 'jsonpatch';
import dal from './dal';
import helper from '../../helper';
import {IODataParams} from "../../types";

export default {
    async writeLog(data: any): Promise<any> {
        const logData = data;
        if(!logData.logTimestamp) logData.logTimestamp = Date.now();
        if(logData.code) logData.code = data.code.toUpperCase();
        return dal.writeLogObject(logData);
    },

    async getLogs(q: IODataParams): Promise<any> {
        const query = await helper.parseOdataQuery(q);
        return dal.getLogs(query);
    },

    async getLog(id: string): Promise<any> {
        return dal.getLog(id);
    },

    async patchLog(id: string, update: any[]) {
        const log = await dal.getLog(id);
        const patched = jsonPatch.apply_patch(JSON.parse(JSON.stringify(log)), update);
        return dal.patchLog(id, patched);
    }
};