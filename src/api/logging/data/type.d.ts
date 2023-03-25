export interface LogObject {
    id?: string;
    _id: string;
    thrown?: number;
    code: "ERROR" | "SUCCESS" | "NOTIFY" | "LOG";
    /**
     * This should be any brief summary data in string format.
     */
    message?: string;
    /**
     * You can directly pipe any error message objects to here.
     */
    details?: {
        [k: string]: unknown;
    };
    [k: string]: unknown;
}