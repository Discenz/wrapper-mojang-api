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
const questions = ["Answer1", "Answer2", "Answer3"];
const name = "NewUsername";

const main = async () => {
  const { uuid, token } = await Yggdrasil.authenticate(email, password);

  if(await Mojang.needSecurity()) await Mojang.answerSecurity(token, questions);

  const status = await Mojang.changeName(uuid, password, name, token)

  if (status == 204) {
    console.log("Name changed to " + name);
  }
  else {
    console.log("Name changed failed. Error: "+ status);
  }
}

main();
```

## Usage

### Yggdrasil.authenticate(email, password, raw=false)
Authenticates your account, gives you accessToken.

Parameters:
* `email` - email of the account
* `password` - password of the account
* `raw` - optional parameter. boolean which defaults to false. If false returns object containing username, uuid, and accessToken. If true it sends the raw response object containing many more variables.

### Yggdrasil.validate(token)
Checks if your token is still valid. Returns boolean (true/false).

Parameters:
* `token`- access token obtained through authentication

### Mojang.check()
Returns status of various Mojang services. Possible values are green (no issues), yellow (some issues), red (service unavailable).

### Mojang.nameToUuid(names)
Returns a list of corresponding uuids to a list of given names

Parameters:
* `names` - Either a username or an array of usernames

### Mojang.uuidAt(username, time = 0)
Returns the uuid of the account which had the specified username at the specified time

Parameters:
* `username` - Minecraft username
* `time` - UNIX timestamp. Or if it is 0 it will return the original name's owner given that the name was changed.

### Mojang.nameHistory(uuid)
Returns history of usernames of an account

Parameters:
* `uuid` - uuid of account

### Mojang.changeName(uuid, password, name, token)
This changes the name of the given account

Parameters:
* `uuid` - the uuid of account
* `password` the password of account
* `name` - the desired name
* `token` - access token obtained through authentication

### Mojang.reserveName(name, token)
Reserve name for an account for 24 hours. Also known as blocking

Parameters:
* `name` - the desired name
* `token`- access token obtained through authentication

### Mojang.needSecurity(token)
Returns whether or not you need to answer security questions for this ip address.

Parameters:
* `token`- access token obtained through authentication

### Mojang.getSecurity(token)
Returns your security questions and the answer id's that need to be sent along with the answers

Parameters:
* `token`- access token obtained through authentication

### Mojang.answerSecurity(token, questions)
Answers your security questions. If you do not have any (SFA alt) it skips

Parameters:
* `token`- access token obtained through authentication
* `questions` - an array containing the 3 answers to your security questions


## Contributors

* [Discens](https://github.com/Discenz) - Main developer

## License
wrapper-mojang-api is licensed under the [MIT](LICENSE) license.
