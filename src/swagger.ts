import ref from '@apidevtools/json-schema-ref-parser';
import merge from 'json-schema-resolve-allof';
import yaml from 'yamljs';
import fs from 'fs';
import logSchema from './api/logging/data/schema';
const swag = yaml.parse(fs.readFileSync('./swagger.yaml', 'utf8'));
const instances = new Map();

class OpenAPI {
    doc: any;
    constructor() {
        this.doc = swag;
    }
    async build(): Promise<any> {
        const updated = await aggregate(this.doc);
        this.doc = await merge(await ref.dereference(updated));
        return this.doc;
    }
    get(): any {
        return this.doc;
    }
}

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

export default {
    // rebuilds every time
    async init(): Promise<any> {
        let oa;
        if(instances.size) {
             oa = instances.get('instance');
             return oa.build();
        }
        console.info('Building api specification');
        oa = new OpenAPI();
        instances.set('instance', oa);
        return oa.build();
    },
    // does not rebuild if it exists
    async getSpec(): Promise<any> {
        let oa;
        if(instances.size) {
            oa = instances.get('instance');
            return oa.get();
        }
        console.info('Building api specification');
        oa = new OpenAPI();
        instances.set('instance', oa);
        return oa.build();
    },
};