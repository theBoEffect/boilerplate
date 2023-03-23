import Log from './model';
import { IMongoQuery } from "../../types";

export default {
    //todo any type
    async writeLogObject(data: any) {
        const log = new Log(data);
        return log.save();
    },
    async getLogs(query: IMongoQuery) {
        return Log.find(query.query).select(query.projection).sort(query.sort).skip(query.skip).limit(query.limit);
    },
    async getLog(id: string) {
        return Log.findOne( { _id: id });
    },
    async patchLog(id: string, data: any) {
        return Log.findOneAndUpdate({ _id: id }, data, { new: true, overwrite: true })
    }
};