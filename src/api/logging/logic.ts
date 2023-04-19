import jsonPatch from 'jsonpatch';
import dal from './dal.js';
import helper from '../../helper.js';
import { IODataParams } from "../../types";
import { DataObject } from "./data/type";

export default {
    async write(data: any): Promise<DataObject> {
        const writeData: DataObject = data;
        //specific to the example - safe to remove
        writeData.code = data.code.toUpperCase();
        //specific to the example - safe to remove
        if(!writeData.thrown) writeData.thrown = Date.now();
        return dal.write(writeData);
    },

    async get(q: IODataParams): Promise<DataObject[]> {
        const query = await helper.parseOdataQuery(q);
        return dal.get(query);
    },

    async getOne(id: string): Promise<DataObject> {
        return dal.getOne(id);
    },

    async patch(id: string, update: any[]): Promise<DataObject> {
        const data = await dal.getOne(id);
        const patched: DataObject = jsonPatch.apply_patch(JSON.parse(JSON.stringify(data)), update);
        return dal.patch(id, patched);
    }
};