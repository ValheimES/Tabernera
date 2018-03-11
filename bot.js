const klasa = require('klasa');
const config = require('./config.json');
const { Client, PermissionLevels } = require('klasa');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const chalk = require('chalk');
var log = require("./log.json");
const fs = require("fs");

const bot = require("./src/imp");

var exports = module.exports = {};

const app = express();

klasa.Client.defaultPermissionLevels

	.addLevel(3, false, (client, msg) => msg.member.roles.exists('name', 'Usuario') || msg.member.roles.exists('name', 'Vieja escuela') )
	.addLevel(4, false, (client, msg) => msg.member.roles.exists('name', 'Administrador (Solo @ antes de las 10 p.m UTC+1)') );

const client = new klasa.Client({
    clientOptions: {
        fetchAllMembers: false
    },
    prefix: '+',
    cmdEditing: true,
    typing: true,
    ownerID: 207164528222404608,
    readyMessage: (client) => `${client.user.tag}, Ready to serve ${client.guilds.size} guilds and ${client.users.size} users`
});


client.login(config.token);