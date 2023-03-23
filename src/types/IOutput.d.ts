export interface IResponseOutput {
    statusCode: number,
    type?: string,
    data?: string | object,
    error?: any,
    message?: string
}