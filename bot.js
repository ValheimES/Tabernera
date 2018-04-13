const klasa = require('klasa');
const config = require('./config.json');
const { Client } = require('klasa');

Client.defaultPermissionLevels
	.addLevel(3, false, (client, msg) => msg.member.roles.exists('id', '397323241846341632') || msg.member.roles.exists('name', 'Vieja escuela'))
	.addLevel(4, false, (client, msg) => msg.member.roles.exists('name', 'Verificador'))
	.addLevel(5, false, (client, msg) => msg.member.roles.exists('name', 'Moderador'))
	.addLevel(6, false, (client, msg) => msg.member.roles.exists('name', 'Administrador'))
	.addLevel(10, false, (client, msg) => msg.member.id === '207164528222404608');

const cliente = new klasa.Client({
	clientOptions: {
		fetchAllMembers: false
	},
	prefix: '+',
	cmdEditing: true,
	cmdLogging: true,
	typing: true,
	ownerID: 207164528222404608,
	readyMessage: (client) => `${client.user.tag}, Ready to serve ${client.guilds.size} guilds and ${client.users.size} users`
});

cliente.login(config.token);
