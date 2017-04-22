# ludum-38

Ludum Dare 38 Game Jam (April 21-24, 2017) http://excaliburjs.com/ludum-38

## Setup

Set up Excalibur submodule:

    git submodule init
    git submodule update
    git fetch

Build excalibur and excalibur-tiled:

    cd lib/excalibur
    npm install
    npm run build

    cd ..

    cd lib/excalibur-tiled
    bower install

## Compiling the game

You will need Node.js and NPM installed.

To compile:

    npm install
    npm start

To update local copy of Excalibur from submodule:

    npm run copy 

## Using VSCode

`Ctrl+Shift+b` will run `npm start` and compile on changes

## Git workflow
- use "Pull (Rebase)" from the Source Control panel of VSCode
