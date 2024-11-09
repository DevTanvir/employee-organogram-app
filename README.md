## Project Overview

Employee organogram app, create and view your organizational hierarchy.

Techs:

- Nestjs
- TypeORM
- Postgres
- JWT Token Authorization
- Docker
- Swagger UI

#### How I approached the Problem

The first thing that came to my mind when I saw that I have to build an API that returns all the Employee Information (hierarchy by position) under any given position in the organogram, was to use recursive functionality, but when dived deep into the problem I saw a emerging parent-child pattern. Then and there I remembered a similar problem I faced on one of my previous project and how I solved it using a Tree! (to be more specific, using TypeORM's Tree Entity)

#### How I've decided my tech and code solution

I have used Nestjs framework with TypeScript, because I like to follow a set ground-rules while building up the app, which in-terms helps with the maintainability, readability, easy-debugging and less error-prone aspects of a project. I've used Postgres DB here, its my go-to RDBMS for project that has a pre-defined structure and relations. For securing the API I've used the reliable JWT Authorization system which can be configured via ENV file of the project. I've also added Swagger UI to test and use the all the APIs of the project, It saves the time and hassle of configuring a 3rd party app and tinkering with input/output of an API. I've used standard terminal based output for logging and Watson is implemented under the hood. The whole app is Dockerized, So this takes cares of the deployment issue. There is also github workflow for build and test, for CI/CD purposes.

For the coding part, Since we need to achieve speed and scalability, I've found TypeORM's Tree entity solutions to be fitting. For a brief moment I considered Nested-set as it is super fast for READ purposes, but at the end I chose Materialized-Path, it is an effective solution to our problem. The path is visible in the DB structure, its pretty straight-forward and future-proof for things like upserts and deletes. I've also added an Extra create employee API as well for the ease of creating and testing the employee organogram API. Apart from these key-points, we have functioning Auth and User module as well. There is also scope for implementing RBAC and ACLs

#### Is there any room for improvement?

I believe each and every project always has some room for improvements, no matter how big or small the project is!

So here is my future improvement plan for the app:

- Implement Redis Caching, using caching mechanism after fetching the organogram will massively improve its performance.
- Write more test-cases, test-cases improves the functionality and early bug detection mechanism for any project. Which in terms helps the app to run error-free in production environment.
- Update and Delete employee feature
- AWS Cloudwatch for logging and monitoring
- AWS ECS for Prod deployments
- Using Coverall for coverage badge

## Installation

Note: when using docker, all the `npm` commands can also be performed using `./scripts/npm` (for example `./scripts/npm install`).
This script allows you to run the same commands inside the same environment and versions than the service, without relying on what is installed on the host.

```bash
$ npm install
```

Create a `.env` file from the template `.env.template` file.

Generate public and private key pair for jwt authentication:

### With docker

Run this command:

```bash
./scripts/generate-jwt-keys
```

It will output something like this. You only need to add it to your `.env` file.

```
To setup the JWT keys, please add the following values to your .env file:
JWT_PUBLIC_KEY_BASE64="(long base64 content)"
JWT_PRIVATE_KEY_BASE64="(long base64 content)"
```

### Without docker

```bash
$ ssh-keygen -t rsa -b 2048 -m PEM -f jwtRS256.key
# Don't add passphrase
$ openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```

You may save these key files in `./local` directory as it is ignored in git.

Encode keys to base64:

```bash
$ base64 -i local/jwtRS256.key

$ base64 -i local/jwtRS256.key.pub
```

Must enter the base64 of the key files in `.env`:

```bash
JWT_PUBLIC_KEY_BASE64=BASE64_OF_JWT_PUBLIC_KEY
JWT_PRIVATE_KEY_BASE64=BASE64_OF_JWT_PRIVATE_KEY
```

## Running the app

We can run the project with or without docker.

### Local

To run the server without Docker we need this pre-requisite:

- Postgres server running

Commands:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Docker

```bash
# build image
$ docker build -t my-app .

# run container from image
$ docker run -p 3000:3000 --volume 'pwd':/usr/src/app --network --env-file .env my-app

# run using docker compose
$ docker compose up
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Migrations

```bash
# using docker
$ docker compose exec app npm run migration:run

# generate migration (replace CreateUsers with name of the migration)
$ npm run migration:generate --name=CreateUsers

# run migration
$ npm run migration:run

# revert migration
$ npm run migration:revert
```

## Architecture

- [Project Structure](./docs/project-structure.md)
