import Boom from '@hapi/boom';

const config = require('./config');

const api = {
    checkPermission(permissions, check) {
        const og = permissions || [];
        const find = og.filter(p=>(p.includes(check)));
        return !!find.length;
    },
    async enforce(req, res, next) {
        try {
            let access = req.authInfo;
            // Let root folks through....
            if (access?.group === config.CORE_EOS_PLATFORM_ID && access.client_credential !== true) return next();
            if(!req.orgContext) throw Boom.forbidden('No context for permissions');
            // check that permission is not a url
            // if x-access-url is present.... (only on jwts...)
            if(access?.['x-access-url']) {
                access = await getPermissions(access?.['x-access-url'], req.authInfo?.token);
            }
            const productAccess = access?.['x-access-products']?.[req.orgContext].split(' ').filter((a) => {
                return (a.includes(p.simpleStreamProductId));
            });
            if(!productAccess?.length) throw Boom.forbidden('No product access');
            const coded = productAccess[0].split(',')?.[1];
            if(!coded) throw Boom.forbidden('No roles assigned');
            const permissions = access?.['x-access-permissions']?.[req.orgContext].split(' ').filter((perm) => {
                return (perm.includes(`${coded}:::`));
            });
            req.allPermissions = permissions;
            if(!permissions.length) throw Boom.forbidden('You do not have permissions');
            req.userPermissions = await mapper(req, coded, permissions);
            req.enforceOwner = false;
            const owner = req.userPermissions.filter((p) => {
                return (p.includes(':own'));
            });
            if(owner.length === req.userPermissions.length) req.enforceOwner = true;
            return next();
        } catch (error) {
            console.info(error)
            next(error);
        }
    }
};

function getTarget (path) {
    let target;
    // define your resource targets here. log included as an example but not required.
    if(path.includes('/log')) target = 'log';
    return target;
}

function getAction (target, method) {
    switch (method?.toLowerCase()) {
        case 'get':
            return 'read';
        case 'delete':
            return 'delete';
        case 'post':
            return 'create';
        case 'patch':
            return 'update';
        case 'put':
            return 'update';
        default:
            return undefined;
    }
}
async function mapper(req, product, permissions) {
    const target = getTarget(req.path);
    const action = getAction(target, req.method);
    const perms = permissions.filter((p) => {
        return (p.includes(`${product}:::${target}::${action}`))
    })
    if(!perms?.length) throw Boom.forbidden('You do not have permission for this action');
    return perms;
}

async function getPermissions(accessUrl, token) {
    try {
        let url = accessUrl;
        if(url.includes('?')) {
            url = `${url}&minimized=true`;
        } else {
            url = `${url}?minimized=true`;
        }
        const options = {
            url,
            method: 'get',
            headers: {
                authorization: `bearer ${token}`
            }
        };
        const result = await axios(options);
        if(!result?.data?.data) throw new Error('Could not get permissions from access url');
        return {
            'x-access-products': result.data.data?.products,
            'x-access-permissions': result.data.data?.permissions,
            'x-access-roles': result.data.data?.roles,
            'x-access-domains': result.data.data?.domains
        }
    } catch (error) {
        console.info(error);
        throw Boom.forbidden('Unable to extract permissions for this user');
    }

}

export default api;