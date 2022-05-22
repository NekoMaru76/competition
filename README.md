# Gameplay
[Clash of Code](https://www.codingame.com/multiplayer/clashofcode), but discord bot, teams, and only JS. Got it?<br />
Currently there are only 10 problems.

# Install
```bash
npm i . --force
```

# Intents
It needs messages event.

# Setup
Create a file with path `/vars/.env` with content
```
TOKEN=
MONGO_URI=
```
(`/` is your project directory)

# Start
```bash
npm start
```

# How to Play
(All the commands below can only be used in DM)

1. Create a battle (room)
```
@battle create-battle <Team Name>
```

2. Create teams for your enemies
```
@battle create-team <Team Name>
```

3a. Make your friends join the teams
```
@battle join-team <Team ID>
```
(Above command should be used by **your friends**, **not you**)

3b. You don't have friends?
```
@battle add-computer <Team ID> <Level[1-3]>
```
<br />

4. Start the battle<br />
```
@battle start-battle
```
<br />

5. Submits your code<br />
```
@battle submit ```js
f(<Function Code>)```
```

or

```
@battle submit f(<Function Code>)
```

Example:<br />
Problem Description: Given an argument, the first argument is a number. Function will return the result of the sum of the argument and `1`.<br />
Command: <br />
```
@battle submit ```js
f(n => n+1)
​```
```

# I need help!
Just do
```
@help <Command Name>
```
or 
```
@help
```
for commands list.
