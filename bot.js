const { Client } = require('klasa');
const config = require('./config.json');

Client.defaultPermissionLevels
	.add(3, (client, msg) => msg.member.roles.exists('id', '397323241846341632') || msg.member.roles.exists('name', 'Vieja escuela'))
	.add(4, (client, msg) => msg.member.roles.exists('name', 'Verificador'))
	.add(5, (client, msg) => msg.member.roles.exists('name', 'Moderador'))
	.add(6, (client, msg) => msg.member.roles.exists('name', 'Administrador'))
	.add(10, (client, msg) => msg.member.id === '207164528222404608');

new Client({
	fetchAllMembers: false,
	prefix: '+',
	cmdEditing: true,
	typing: true,
	ownerID: 207164528222404608,
	readyMessage: (client) => `${client.user.tag}, Ready to serve ${client.guilds.size} guilds and ${client.users.size} users`
}).login(config.token);
