import Model from './data/model.js';
import { IMongoQuery } from "../../types";
import {DataObject} from "./data/type";

export default {
    async write(data: DataObject): Promise<any> {
        const model = new Model(data);
        return model.save();
    },
    async get(query: IMongoQuery): Promise<any> {
        return Model.find(query.query).select(query.projection).sort(query.sort).skip(query.skip).limit(query.limit);
    },
    async getOne(id: string): Promise<any> {
        return Model.findOne( { _id: id });
    },
    async patch(id: string, data: DataObject): Promise<any> {
        return Model.findOneAndReplace({ _id: id }, data, { new: true, overwrite: true })
    }
};