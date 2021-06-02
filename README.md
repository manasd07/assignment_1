### 📚 Description

This project is a learning purpose assignment where in I have implemented mongodb tree architecture methods and users authentication flow.
You can also find the remote repository at https://github.com/manasd07/assignment_1

---

### 🛠️ Prerequisites

#### Non Docker

- Please make sure to either have MongoDB Community installed locally or a subscription to Mongo on the cloud by configuration a cluster in [atlas](https://www.mongodb.com/cloud/atlas).

#### Docker 🐳

- Please make sure to have docker desktop setup on any preferred operating system to quickly compose the required dependencies. Then follow the docker procedure outlined below.

**Note**: Docker Desktop comes free on both Mac and Windows, but it only works with Windows 10 Pro. A workaround is to get [Docker Toolbox](https://docs.docker.com/toolbox/toolbox_install_windows/) which will bypass the Windows 10 Pro prerequisite by executing in a VM.

---

### 🚀 Deployment

#### Manual Deployment without Docker

- Create a `.env` file using the `cp .env.example .env` command and replace the existing env variables with personal settings (MongoDB URL either `srv` or `localhost`)
- If there isn't any .env file present , create one and add one field named ATLAST_URI (your connection string)

- Download dependencies using `npm i` or `yarn`

- Start the app using `npm run start` or `npm start` for development (the app will be exposed on the port 5000;

### 🔒 Environment Configuration

By default, the application comes with a config module that can read in every environment variable from the `.env` file.

**ATLAS_URI** - the URL to the MongoDB collection

---

### 🏗 Other Details

[Express](https://expressjs.com/)

ExpressJS : The framework which is used on top of nodejs for this particular project.

### 📝 Open API

Out of the box, the web app comes with Swagger; an [open api specification](https://swagger.io/specification/), that is used to describe RESTful APIs.
The swagger can be generated on-demand, simply, by typing `npm run start:dev`. This will run the project and _start hosting on [localhost](http://localhost:5000/api/docs/static/index.html)_.

bash

# Run project in watch mode

$ npm run start

## Table of contents

- [General info](#general-info)
- [Technologies](#technologies)
- [Setup](#setup)
- [Documentation](#Documentation)

## General info

At Deqode , I want to explore new things and that comes up with my first assignment wherein I learnt aggregation techniques , generating random referalls and maintained ancestors and descendants hierarchy. Users module contain basic CRUD with JWT tokens implementation.

## Technologies

Project is created with:

- Node
- ExpressJS

### Module Definitions

This repo includes following modules

- User management

All the services related to these modules can be found here. Moreover, you can access our swagger docs from ${base_path}/api/docs for documented endpoints related to services.

### Project Setup and related info

After installing all the dependencies by `npm install` or `npm i` , one can start the application using different commands such as:

- npm run start (Starts the application server in watch mode)
- After this you may access the endpoints from your preferred testing application such as postman,insomnia,browser,etc.

### Documetatation

- Users:
  - User management
    - Register Users
    - Login User
    - Get all user details [authenticated]
    - Get particular user details [authenticated]
    - Invite another user to be its parent [authenticated]
    - Edit User details [authenticated]
    - Delete User details [authenticated]
