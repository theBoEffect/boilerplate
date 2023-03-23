import { Request, Response, NextFunction} from "express";

export async function responseIntercept (req: Request, res: Response, next: NextFunction) {
    res.respond = function(output: any): any {
        try {
            const status = output.statusCode;
            delete output.statusCode;
            return this.status(status || 200).json(output);
        } catch (error) {
            next(error);
        }
    };
    next();
}