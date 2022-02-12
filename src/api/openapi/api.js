import swagger from '../../swagger';
import modify from './swag';
const pJson = require('../../../package.json');

export default {
    async serveVersion(req, res, next) {
        try {
            const date = new Date();
            return res.render('index', {
                title: pJson.name,
                version: pJson.version,
                description: pJson.description,
                by: pJson.author,
                url: pJson.person.url,
                year: date.getFullYear(),
                home: pJson.homepage
            });
        } catch (e) {
            next(e)
        }
    },
    async serveSwaggerUI(req, res, next) {
        try {
            return res.render('swagger', { title: pJson.name })
        } catch (e) {
            next(e);
        }
    },
    async serveApiJson(req, res) {
        try{
            let swag = JSON.parse(JSON.stringify(swagger));
            swag = modify.updateSwag(swag);
            return res.json(swag);
        }catch (error) {
            console.info(error);
            return res.json(swagger);
        }
    },
    async reDocApi(req, res, next) {
        try {
            return res.render('api', { title: pJson.name })
        } catch (e) {
            next(e);
        }
    },
    async oauth2Redirect(req, res, next) {
        try {
            return res.render('openapi-redirect');
        } catch (e) {
            next(e);
        }
    }
};