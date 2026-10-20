## What is this

This is WIP - Work in progress and under construction. The idea is:

This is an app that allows an organization to hold general elections. It's intended use is while holding general assemblies and elections within these. An emphasis have been put on anonymity. Names are associated with polls only, not individual answers.

## What is it made with

#### Front-end

> ./client

- UI: TailwindCSS
- Typescript
- React & React Hooks
- React Router

#### Back-end

> ./server

- NodeJS & Express
- MongoDB
- JWT and bcrypt library for security
- Hapi/Joi for data validation

## Install and run back-end

In root
`$ npm install`

Make a .env file in the root of the project.
Add two entries to this file:
`DB_CONNECT = <your own mongodb atlas url link>`
`TOKEN_SECRET = some_secret`
Go to [cloud.mongodb.com](http://cloud.mongodb.com) to learn how to make and connect a database.

To run the app locally, run:

`$ npm start`

## Install and run front-end

cd into client

`$ npm install`

`$ npm run build:css`

`$ npm start`
