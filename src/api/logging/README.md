# Example API Setup

You can use this logging directory as an example of how to approach each API resource you want to define. This directory itself is not required for the continued use of the template.

## General Instructions

1. cp logging newApi
2. define a new data/schema to account for the objects you wish to include in the openAPI spec and which you want to create types from
3. add a reference to this new schema (newApi/data/schema) in the ./swagger.ts openApi generator class (line 27+)
4. make note of your schema objects that require type definitions and use those names in the next step to auto generate your types form the schema
5. yarn swag-type SCHEMA-NAME TYPE-NAME
    * As an example, to generate the type example you see now, we would use "yarn swag-type Log LogObject"
6. update your data/model definition to match your type
7. change your api, logic, and dal files to handle your crud operations
8. add your routes
9. update ./routes/index to include your routes
10. update ./app to include your routes (line 6 and line 26+)