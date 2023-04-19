import { config } from '../../config.js';
import { IOpenAPI } from '../../types';
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pJson = require('../../../package.json');

export default {
    updateSwag(swag: IOpenAPI.Document) {
        swag.info.version = pJson.version;
        swag.info.title = pJson.name;
        swag.info.description = `${pJson.description} by: <a href="${pJson.url}">${pJson.author}</a>`;
        swag.info['x-logo'].url = pJson.logo;
        if (config.HOST) swag.servers = [{url: `${config.PROTOCOL}://${config.HOST}/api`}];
        return swag;
    }
}