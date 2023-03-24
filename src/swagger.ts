import ref from '@apidevtools/json-schema-ref-parser';
import merge from 'json-schema-resolve-allof';
import yaml from 'yamljs';
import fs from 'fs';
import logSchema from './api/logging/schema';
const swag = yaml.parse(fs.readFileSync('./swagger.yaml', 'utf8'));
let doc = swag;

//todo this needs to be a singleton class...

/**
 * import swagger from '../../swagger'
 * console.info(swagger.components.schemas.Log);
 * import { compile } from 'json-schema-to-typescript'
 *
 * compile(swagger.components.schemas.Log, 'LogSchema')
 *     .then(ts => console.info(ts));
 * @param swag
 */

async function aggregate(swag: any) {
    const api = swag;
    const agg = [
        logSchema.schema,
        //next one here...
    ];
    agg.forEach((s: any) => {
        Object.keys(s).forEach((k: string) => {
            api.components.schemas[k] = s[k];
        })
    })
    return api;
}

(async()=>{
    const updated = await aggregate(doc);
    doc = await merge(await ref.dereference(updated));
})();

export default doc;