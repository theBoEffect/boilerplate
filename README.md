# Boilerplate Service

A boilerplate typescript micro service that runs as docker or lambda. Click "Use this Template" to use this for your service.

[![CI](https://github.com/theBoEffect/boilerplate/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/theBoEffect/boilerplate/actions/workflows/main.yml)

#### follow me:
* [twitter](https://twitter.com/theboeffect)
* [linkedIn](https://www.linkedin.com/in/bmotlagh/)
* [instagram](https://www.instagram.com/theboeffect/)

## Key Stack Components

* TypeScript
* Express
* Mongoose -> MongoDB
* Serverless-http
* openAPI/Swagger
* Express-OpenAPI-Validate
* @hapi/boom
* oData API query
* JSON Patch
* Passport (see libs in package.json)
* Jest

## Features

* Authentication and Authorization via (UE Auth)[https://ueauth.com]
* Configurable MongoDB connection
* oData support for queries
* JSON Patch implemented for updates with mongodb
* OpenAPI (swagger) and Swagger UI (/swagger)
* Automatic API Documentation Generated via ReDoc (/api)
* Automatic schema validation using the OpenAPI spec built in as middleware
* Automatic Type definitions using OpenAPI spec (yarn swag-spec SWAGGER-OBJEC TYPE-NAME)
* Error handling via @hapi/Boom
* Works with Docker or Lambda
* Jest test harness

Have other ideas? Feel free to PR!

### oData Spec

https://www.odata.org/documentation/

### JSON Patch

http://jsonpatch.com/

### DB

If you'd rather use a different database or ODM, the following modifications are necessary:

* change connection.ts to the appropriate DB
* validate that slsapp and start both correctly implement connection.ts
* in each of your api/resources, change the dal.ts file to access the new DB using the new ODM/ORM

## Quickstart Run

* Click "Use this Template" at the top  of the repository and setup your project
* clone your project to your machine
* start mongodb on port 27017
    * I find the easiest way to do this is via docker in a terminal
    * docker run -p 27017:27017 mongo
* Copy ./.env_ci to ./.env and modify env.dev.json to set runtime configuration data
* yarn test (will run yarn and build)
* yarn dev
* navigate to localhost:3000

### Configure For Your Service

* Update the following in package.json
    * name
    * author
    * person
    * description
    * homepage (your website or project website)
    * logo (your logo or project logo url)
* Do the above quickstart now...
* Add src/api resources using the (logging example)[./src/api/logging]