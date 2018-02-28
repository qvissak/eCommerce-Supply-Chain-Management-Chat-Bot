[![Maintainability](https://api.codeclimate.com/v1/badges/2a3a0404d72d0e0bb02c/maintainability)](https://codeclimate.com/repos/59d638f77cdff10283001155/maintainability)
# LogicBrokerBot
Chat bot using Microsoft's Bot framework and LUIS API across Cortana, Skype, Slack and Facebook to handle common supply chain information such as specific order, shipment and shipping data.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
What things you need to install the software and how to install them.

* [Git](https://git-scm.com/) - Version control software
* [Node](https://nodejs.org/en/) - Server framework
* [npm](https://www.npmjs.com/) - Package manager
* [Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator/releases) - Local Environment Simulator

### Installing
A step by step series of commands that tell you how to get a development environment running.

```
git clone git@github.com:qvissak/LogicBrokerBot.git
```
```
cd LogicBrokerBot/
```
```
npm install
```

### Deployment
Set up environment variables. Contact a member of the team to get the correct keys.
```
cp .env.example .env
```

Launch the application server. Connect to the bot framework emulator as a client to query the server.
```
npm start
```
