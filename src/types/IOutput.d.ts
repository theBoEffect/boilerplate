export interface IResponseOutput {
    statusCode: number,
    type?: string,
    data?: string | object,
    count?: number,
    error?: any,
    message?: string
}