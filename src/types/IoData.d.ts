import Log from "../api/logging/model";

export interface IODataParams {
    $filter?: string,
    $select?: string,
    $skip?: string,
    $top?: string,
    $orderby?: string
}

export interface IMongoQuery {
    query?: any,
    projection?: any,
    sort?: any,
    skip?: any,
    limit?: any
}