export default {
    schema: {
        "writeLog": {
            "title": "WriteLogObject",
            "type": "object",
            "required": [
                "code"
            ],
            "properties": {
                "code": {
                    "type": "string",
                    "enum": [
                        "ERROR",
                        "SUCCESS",
                        "NOTIFY",
                        "LOG"
                    ]
                },
                "message": {
                    "type": "string",
                    "description": "This should be any brief summary data in string format."
                },
                "details": {
                    "type": "object",
                    "description": "You can directly pipe any error message objects to here."
                }
            }
        },
        "Log": {
            "title": "LogObject",
            "type": "object",
            "allOf": [
                {
                    "$ref": "#/components/schemas/writeLog"
                }
            ],
            "properties": {
                "id": {
                    "type": "string",
                    "format": "uuid"
                },
                "thrown": {
                    "type": "number"
                }
            }
        }
    }
}