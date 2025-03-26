# App template

This repository contains a template for a full-stack application. The application is divided into modules, each of which is a separate project.

## Basic modules structure

- [server](./server): A Node.js server that serves the frontend and provides an API for the frontend to interact with the ui. It also contains others modules not related to server itself but to the whole application somehow related to be used on backend.

- [client](./client): A React frontend that interacts with the server. Also there can be modules that are used on frontend only.

## Prefilled modules

- [server/main](./server/main): A module that contains the main server logic. It is a good place to start when you want to add new server logic. There is also simple implementation of the API that can be used as a reference.

- [client/web](./client/web): A module that contains the main frontend logic. It is a good place to start when you want to add new frontend logic. There is also simple implementation of the frontend react app that use cookie, stores and basic app structure.

## Getting Started

Each module contains a `README.md` file with instructions on how to run the module.