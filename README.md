# wrapper-mojang-api

[![Discord](https://img.shields.io/badge/chat-on%20discord-brightgreen.svg)](https://discord.gg/94MgDaP)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NPM](https://img.shields.io/npm/v/wrapper-mojang-api)](https://www.npmjs.com/package/wrapper-mojang-api)


wrapper-mojang-api is a simple JavaScript wrapper for the Mojang API. The package is divided into 2 submodules: Yggdrasil for authentication, and Mojang for requests to the Mojang API. All requests are done asynchronously using the axios package.

## Installation

`npm install --save wrapper-mojang-api`

## Example

This example shows how you can change an accounts username using wrapper-mojang-api

```js
const { Yggdrasil, Mojang } = require("wrapper-mojang-api");

const email = "user@domain.net";
const password = "password";
const questions = ["answer", "answer", "answer"];
const newName = "newname";

const main = async () => {
  const { accessToken, selectedProfile } = await Yggdrasil.authenticate(email, password);

  if (await Mojang.needSecurity(accessToken)) await Mojang.answerSecurity(accessToken, questions);

  try {
    await Mojang.changeName(selectedProfile.id, password, newName, accessToken);
    console.log("Name changed to "+ newName);
  } catch (err) {
    console.log("Name change failed. Error code "+err.response.status);
  }

}

main();
```

## Usage

### Yggdrasil.authenticate(email, password, requestUser = false)
Authenticates your account, gives you accessToken.

Parameters:
* `email` - email of the account
* `password` - password of the account
* `requestUser` - optional parameter which defaults to false. Adds user object with aditional information to the response

Response:
```json
{
  "accessToken": "",
  "clientToken": "",
  "availableProfiles": [ { "name": "", "id": "" } ],
  "selectedProfile": { "name": "", "id": "" }
}
```

### Yggdrasil.validate(token)
Checks if your accessToken is still valid.

Parameters:
* `token`- access token obtained through authentication

Response:
* `true` or `false`

### Mojang.check()
Returns status of various Mojang services. Possible values are green (no issues), yellow (some issues), red (service unavailable).

Response:
```json
[
  { "minecraft.net": "green" },
  { "session.minecraft.net": "green" },
  { "account.mojang.com": "green" },
  { "authserver.mojang.com": "green" },
  { "sessionserver.mojang.com": "red" },
  { "api.mojang.com": "green" },
  { "textures.minecraft.net": "green" },
  { "mojang.com": "green" }
]
```

### Mojang.nameToUuid(names)
Returns a list of corresponding uuids to a list of given names

Parameters:
* `names` - Either a username or an array of usernames

Response:
```json
[
    {
        "id": "0d252b7218b648bfb86c2ae476954d32",
        "name": "maksimkurb",
        "legacy": true,
        "demo": true
    }
]
```
* `legacy`(unmigrated) and `demo`(unpaid) only appear when true

### Mojang.uuidAt(username, time = 0)
Returns the uuid of the account which had the specified username at the specified time

Parameters:
* `username` - Minecraft username
* `time` - Date object or unix timestamp (time in seconds since 1-1-1970). Or if it is 0 it will return the original name's owner given that the name was changed.

Response:
```json
{
  "id": "7125ba8b1c864508b92bb5c042ccfe2b",
  "name": "KrisJelbring"
}
```
### Mojang.nameHistory(uuid)
Returns history of usernames of an account

Parameters:
* `uuid` - uuid of account

Response:
```json
[
  {
    "name": "Gold"
  },
  {
    "name": "Diamond",
    "changedToAt": 1414059749000
  }
]
```

### Mojang.profile(uuid)
This returns the profile of the requested user (username, skin, cape...). You can only request the same profile 1 time a minute.

Parameters:
* `uuid` - uuid of account

Response:
```json
{
    "id": "<profile identifier>",
    "name": "<player name>",
    "properties": [
        {
            "name": "textures",
            "value": "<base64 string>",
        }
    ]
}
```

### Mojang.changeName(uuid, password, name, token)
This changes the name of the given account

Parameters:
* `uuid` - the uuid of account
* `password` the password of account
* `name` - the desired name
* `token` - access token obtained through authentication

Response:
* `204` -	Success
* `400` -	Name is unavailable
* `401` -	Unauthorized
* `403` -	Forbidden
* `504` -	Timed out

### Mojang.reserveName(name, token)
Reserve name for an account for 24 hours. Also known as blocking

Parameters:
* `name` - the desired name
* `token`- access token obtained through authentication

Response:
* `204` -	Success
* `400` -	Name is unavailable
* `401` -	Unauthorized
* `403` -	Forbidden
* `504` -	Timed out

### Mojang.needSecurity(token)
Returns whether or not you need to answer security questions for this ip address.

Parameters:
* `token`- access token obtained through authentication

Response:
* `true` or `false`

### Mojang.getSecurity(token)
Returns your security questions and the answer id's that need to be sent along with the answers

Parameters:
* `token`- access token obtained through authentication

Response:
```json
[
  {
    "answer": {"id": 123},
    "question": {
      "id": 1,
      "question": "What is your favorite pet's name?"
    }
  },
  {
    "answer": {"id": 456},
    "question": {
      "id": 2,
      "question": "What is your favorite movie?"
    }
  },
  {
    "answer": {"id": 789},
    "question": {
      "id": 3,
      "question": "What is your favorite author's last name?"
    }
  }
]
```

### Mojang.answerSecurity(token, questions)
Answers your security questions. If you do not have any (SFA alt) it skips

Parameters:
* `token`- access token obtained through authentication
* `questions` - an array containing the 3 answers to your security questions


## Contributors

* [Discens](https://github.com/Discenz) - Main developer

## License
wrapper-mojang-api is licensed under the [MIT](LICENSE) license.
