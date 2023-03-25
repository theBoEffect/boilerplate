import { compile } from 'json-schema-to-typescript';
import openApi from './src/swagger';
import clipboard from "clipboardy";

(async(object, name) => {
    const args = process.argv;
    const o = (object) ? object : args[2];
    const n = (name) ? name : args[3];
    if(!o) {
        console.error('MISSING ARGUMENTS --', 'First argument should be the object from your swagger spec within component/schemas', 'Second argument should be what you would like to call this type.')
        process.exit(1);
    }
    if(!n) {
        console.error('MISSING ARGUMENTS --', 'Second argument should be what you would like to call this type.')
        process.exit(1);
    }
    const swagger = await openApi.init();
    const swaggerObject = swagger.components.schemas[o];
    const ts = await compile(swaggerObject, n)
    clipboard.writeSync(ts);
    console.info(ts)
    console.info('SUCCESS! - the above type definition is in your clipboard. Simply go to the file you wish and paste it in to modify');
})()