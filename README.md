# NodeJs Golden Raspberry Awards - Using Database

A implementation of example backend application for the Golden Raspberry Awards powered by Fastify running on node.js.

## Features

 - TypeORM Database connection (Memory)
 - ORM
 - HTTP REST API
 
## Usage

To run this application, you'll need [Node.js](https://nodejs.org/en/) (which comes with [npm](https://www.npmjs.com/)) installed on your computer.

Then from your command line:

```
# Install dependencies
npm install

# Run the app in development
npm run dev

# Build and run the production version
npm run start
```

## API Routes

| Method | Path | Return | Description |
|---|---|---|---|
| `GET` | / | HTML | Get the initial form to upload movies from csv file |
| `GET` | /movies | HTML | Get all movies from the model and return as a html table |
| `POST` | /upload-movies | json | Create new movies from the csv uploaded |
| `GET` | /movies/:id | json | Get a single movie by ID |
| `PUT` | /movies/:id | json | Update a single movie by ID |
| `DELETE` | /movies/:id | json | Delete a movie by ID |
| `GET` | /producers | json | Get custom gap producers |

## Integration tests

This application is equipped with some integration tests to validate the CSV file inputs.

```
# Run integration tests
npm test
```

## HTTP REST API testing

In [VsCode](https://code.visualstudio.com/) you can use [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension to test some REST API end-points.<br />
You can find these tests in the [routes.http](routes.http) file.

## Built With

 - [Node.js](https://nodejs.org/en/)
 - [Fastify](https://fastify.dev/)
 - [TypeORM](https://typeorm.io/)

## Licence

MIT
