# K3.1
[![Build status](https://dev.azure.com/spenceradolph/IslandRushK3/_apis/build/status/IslandRushK3-CI)](https://dev.azure.com/spenceradolph/IslandRushK3/_build/latest?definitionId=7)

Island Rush is a military strategy teaching tool/game for use by DFMI at The United States Air Force Academy.

## Setup

- This game is built on Node, React, and MySQL. Please be familiar with these frameworks before starting.

- Connections to the database are handled by environment variables.
  - DB_HOSTNAME -> Server running the database
  - DB_USERNAME
  - DB_PASSWORD -> plaintext
  - DB_NAME -> Name of the database

- Course Director Login credentials are also stored in the environment.
  - CD_LASTNAME -> lowercase lastname
  - CD_PASSWORD -> MD5 hash

- Lastly, the port used is an environment variable (usually set by the hosting environment)
  - PORT -> defaults to 80 when no value given (let cloud hosts auto-assign this)

- Reference the package.json in the root directory for commands to install and run (among other dev commands)
  - First make sure node (latest version) is installed
  - In root directory
    - "npm install" -> installs the server dependencies
    - "npm clientInstall" -> installs the client dependencies
    - "npm clientBuild" -> creates optimized production build
      - NOTE: The client/build/index.html file that is created must be renamed to game.html***
        - Linux Command: "mv index.html game.html" (when in the build directory)
        - Windows Command: "ren index.html game.html" (when in the build directory)
        - This action can be automated by most CI-CD pipelines
    - "npm start" -> starts the server
