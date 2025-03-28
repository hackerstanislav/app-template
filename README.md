# App template

This repository contains a template for a full-stack application. The application is divided into modules, each of which is a separate project. This template is a good starting point for a new project.

## Basic modules structure

- [server](./server): A Node.js server that serves the frontend and provides an API for the frontend to interact with the ui. It also contains others modules not related to server itself but to the whole application somehow related to be used on backend.


- [client](./client): A React frontend that interacts with the server. Also there can be modules that are used on frontend only.

## Prefilled modules

- [server/main](./server/main): A module that contains the main server logic. It is a good place to start when you want to add new server logic. There is also simple implementation of the API that can be used as a reference. Server used [express](https://expressjs.com/) as a server framework and [mongodb](https://www.mongodb.com/) as a database. There are also prepared middlewares for logging, sessions, state, cookies and store connector to database. Server also support socket.io for real-time communication. By default also authentication is implemented using [kinde provider](https://kinde.com).


- [client/web](./client/web): A module that contains the main frontend logic. It is a good place to start when you want to add new frontend logic. There is also simple implementation of the frontend react app that use cookie, stores and basic app structure. App is also prepared for translations and support for multiple languages. Also is connected to login, logout and register in example app. There is also basic router implemented. 

## Getting Started

There need to be some dependencies installed.

1. Install [Node.js](https://nodejs.org/en/download/) - Current version of required nodejs is in [.nvmrc](./.nvmrc) file.
2. Install [mongodb](https://www.mongodb.com/docs/manual/installation/)
3. Run `npm install` in the root directory to install all dependencies.

### Main scripts

1. Run `npm run server/build` to build the server.
2. Run `npm run server/web/build` to build the client.
3. Run `npm run server/development/database` to start the database server.
4. Run `npm run server/development/start` to start the server in development mode.
5. Run `npm run client/web/build` to build the client in.
6. Run `npm run client/web/development` to start the client in development mode.

### Other tasks

1. Run `npm run client/web/extract-locales` - to extract locales from the code in the client app.
2. Run `npm run prettier` - to run prettier on the whole project.
3. Run `npm run lint` - to run eslint on the whole project.
4. Run `npm run start` - to run the server and client in production mode on port **8080**.