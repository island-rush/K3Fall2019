# Island Rush V3

[![Build status](https://dev.azure.com/spenceradolph/IslandRushK3/_apis/build/status/IslandRushK3-CI)](https://dev.azure.com/spenceradolph/IslandRushK3/_build/latest?definitionId=7)

![FullGameboard](https://github.com/island-rush/Images/blob/master/K3/fullGameboard.PNG)

Island Rush is a military strategy teaching tool/game for use by DFMI at The United States Air Force Academy. The game is deployed as a web-app, and consists of 2 teams of 4-5 students each playing aginst each other to dominate a domain of islands. Students use lessons of strategy they have learned and put them into practice to demonstrate their knowledge.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system. Please note that Island Rush is designed and tested on Chrome, and other browsers may work but are not officially recommended or supported.

### Prerequisites

NodeJS is used on both the server and client. NPM is used for installing and dependency tracking. It should, however, be included when you install Node. MySQL is used for the database. This can be installed locally or accessed externally.

```
node
mysql
```

### Installing

These commands will get you a working copy of this repository, and set up all development dependencies.

Clone the reposority.
```
git clone https://github.com/island-rush/K3.git
cd K3
```

Install node modules for the server.
```
npm install
```

Install node modules for the client.
```
cd ./client
npm install
cd ..
```

Give node extra memory with NODE_OPTIONS env variable. (This command may change based on OS / Terminal) (Works with 'Git Bash')
```
export NODE_OPTIONS=--max_old_space_size=4096
```

All dependencies should now be installed and you should be able to run the server for local development and testing.

### Database

There are many methods of running / hosting a MySQL server. Once the database exists, please create a user/password for the game to use. Set these values in the env variables, or for easier/quicker setup...manually set them in the ./server/database.js file. Some defaults already exist here, simply overwrite them or add your own according to the examples.

### Development

The following are a list of commands used to control the frontend and backend. Please reference the ./package.json file for all commands, dependencies, dev dependencies, and repository configurations.

This command will run only the backend server.
```
npm run devBackend
```

Running the backend allows access to these non-game pages, and admin controls.

- /index.html
- /teacher.html
- /courseDirector.html
- /credits.html
- /troubleshoot.html

Note there are several env variables used by the backend.

- CD_LASTNAME = Course Director Last Name -> default is "Smith"
- CD_PASSWORD = Course Director MD5 Password Hash -> default is MD5('asdf')
- DB_NAME = name of database -> default is 'k3'
- DB_HOSTNAME = database host -> default is 'localhost'
- DB_USERNAME = database user -> default is 'root'
- DB_PASSWORD = database password -> default is ''
- SESSION_SECRET = optional secret used by session cookies for security
- NODE_ENV = 'production' or 'development'...this determines how the backend serves out the frontend.
- NODE_OPTIONS = options for running node. (--max_old_space_size=4096)
- PORT = server port (typically pre-set in production environments) -> default is 80

Inserting the database tables and creating/deleting games can be accomplished from the /courseDirector page. Login from the homepage teacher login with the creditionals used in the env variables (or defaults). Here you can click a button to insert the database tables ("INITIALIZE DATABASE"). This action must be done before all others. 

The /courseDirector page is used for creating games, deleting games, and resetting teacher passwords. You must create a game here in order to play the game. It is recommended to create a game with the default values that are always loaded in the homepage. This will prevent typing in credentials everytime the client needs to login. ('m1a1', 'adolph'). 

The password used when creating a game is the password used by teachers to login to their /teacher page. Teachers are able activate/deactivate their games, as well as reset the game to have initial pieces on the board. They can also reset team passwords, but simply leaving these as the defaults are fine when developing.

Note: Course Director default credentials are set within ./server/adminFunctions/adminLoginVerfy.js

This command will run the frontend react server by itself.
```
npm run devFrontend
```

Running the frontend allows access to the main /game.html page. This is running a react development server. If the backend server is running, it will redirect the frontend to the homepage to enforce an authenticated session. Without the backend running, the frontend won't redirect (great for developing react components) but won't receive any game info, and will appear as if it is loading.

This command will run the frontend and backend simultaneously. 
THIS COMMAND IS TYPICALLY USED FOR ALL DEVELOPMENT.
```
npm run dev
```

Please note that production environments will build the client, creating static files in ./client/build for the server to use. If the NODE_ENV is set to 'production', the backend will use this. Otherwise, it will redirect /game to localhost:3000, as this is the default port for the react server. This can be changed in the ./server/router.js file. It is possible to manually build the client using the following command.

```
npm run buildClient
```

## Deployment

A combination of the commands listed above can be configured inside an automated CICD pipeline, or manually executed on whatever production machine is in use. Please set env variables before executing, and ensure the database is accessable.

Note: the ./web.config is currently being used to configure the environment to run on the Azure Cloud. This application should run as any typical node server, for which there are plenty of guides and configurations available online to help with deploying.

## Built With

- [node](https://nodejs.org/en/docs/) - Backend Server
- [mysql](https://dev.mysql.com/doc/) - Database
- [react](https://reactjs.org/docs/getting-started.html) - Frontend Framework

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Version

Version 3.1.0

---

Please [report](https://gitreports.com/issue/island-rush/K3) any issues.
