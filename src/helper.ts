import { createQuery } from 'odata-v4-mongodb'
import { IODataParams } from './types';
import Boom from '@hapi/boom';

export default {
    /**
     * Checks string to see if its JSON
     * @param check
     * @returns {boolean}
     */
    isJson(check: string|undefined): boolean {
        try {
            JSON.parse(check!);
            return true;
        } catch (e) {
            return false;
        }
    },
    elementExists (property: string, check: string, arr: any[]): boolean {
        return arr.some((el) => {
            return el[property] === check;
        });
    },
    async parseOdataQuery (data: IODataParams): Promise<any> {
        try {
            let query: string | null = null;
            if (data.$filter) {
                query = `$filter=${data.$filter}`;
            }
            if (data.$select) {
                query = (query === null) ? `$select=${data.$select}` : `${query}&$select=${data.$select}`;
            }
            if (data.$skip) {
                query = (query === null) ? `$skip=${data.$skip}` : `${query}&$skip=${data.$skip}`;
            }
            if (data.$top) {
                query = (query === null) ? `$top=${data.$top}` : `${query}&$top=${data.$top}`;
            }
            if (data.$orderby) {
                query = (query === null) ? `$orderby=${data.$orderby}` : `${query}&$orderby=${data.$orderby}`;
            }
            return createQuery(query!);
        } catch (error) {
            throw Boom.badRequest('Check your oData inputs', data);
        }

    }
};