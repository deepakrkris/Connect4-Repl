# Connect4 - SideStacker Game
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

![cover](https://github.com/deepakrkris/UI_workout/blob/main/day02/05_connect4/connect4_page.png?raw=true)

SideStacker version of Connect-4

## Table of Content

- [Requirements](#Requirements)
- [Installation](#installation)
- [Design](#Design)
- [Licence](#Licence)
- [Database](#Database)

## Requirements

This project requires local installations of the following

- [Typescript](https://www.typescriptlang.org/download)
- [Node.js](https://nodejs.org)

## Installation

Step 1: Clone the repo

```bash
git@github.com:deepakrkris/UI_workout.git
```

Step 2: Build

```bash
$ cd day02/05_connect4
$ npm run build
```

Step 3: Start the server

```bash
$ npm start
```

Step 4: Generate game code

![generate game code](https://github.com/deepakrkris/UI_workout/blob/main/day02/05_connect4/Generate_game_code.png?raw=true)


Step 5: Load game page in browser and enter user id and game code

![load game page](https://github.com/deepakrkris/UI_workout/blob/main/day02/05_connect4/user_details.png?raw=true)


## Design


![Design](https://github.com/deepakrkris/UI_workout/blob/main/day02/05_connect4/Connect4_components.excalidraw.png?raw=true)


## Database

TypeOrm is used and as such configurations for postgres and sqlite are available

- Snapshot of a sample game state in postgres
![Snapshot of database](https://github.com/deepakrkris/UI_workout/blob/main/day02/05_connect4/connect4_save_to_postgres.png?raw=true)

## Licence
[MIT](/LICENCE)
This repo is licenced under the MIT Licence.
