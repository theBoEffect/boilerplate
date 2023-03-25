import Log from './data/model';
import { IMongoQuery } from "../../types";
import {LogObject} from "./data/type";

export default {
    //todo any type
    async writeLogObject(data: LogObject): Promise<any> {
        const log = new Log(data);
        return log.save();
    },
    async getLogs(query: IMongoQuery): Promise<any> {
        return Log.find(query.query).select(query.projection).sort(query.sort).skip(query.skip).limit(query.limit);
    },
    async getLog(id: string): Promise<any> {
        return Log.findOne( { _id: id });
    },
    async patchLog(id: string, data: LogObject): Promise<any> {
        return Log.findOneAndUpdate({ _id: id }, data, { new: true, overwrite: true })
    }
};