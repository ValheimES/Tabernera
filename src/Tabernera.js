const { Client } = require('klasa');
const config = require('../config.js');

Client.defaultPermissionLevels
	.add(3, (_, msg) => msg.guild && msg.guild.configs.roles.inicial.some(role => msg.member.roles.has(role)), { fetch: true })
	.add(4, (_, msg) => msg.guild && msg.guild.configs.roles.verificador && msg.member.roles.has(msg.guild.configs.roles.verificador), { fetch: true })
	.add(5, (_, msg) => msg.guild && msg.guild.configs.roles.moderador && msg.member.roles.has(msg.guild.configs.roles.moderador), { fetch: true })
	.add(6, (_, msg) => msg.guild && msg.guild.configs.roles.administrador && msg.member.roles.has(msg.guild.configs.roles.administrador), { fetch: true })
	.add(9, (_, msg) => ['242043489611808769', '207164528222404608'].includes(msg.author.id), { break: true })
	.add(10, (_, msg) => msg.author.id === '242043489611808769', { break: false });

const client = new Client({
	commandEditing: true,
	commandMessageLifetime: 120,
	disabledCorePieces: ['commands'],
	messageCacheLifetime: 120,
	messageCacheMaxSize: 100,
	messageSweepInterval: 120,
	prefix: '+',
	presence: { activity: { name: '+ayuda', type: 'LISTENING' } },
	customPromptDefaults: { quotedStringSupport: true, limit: 5 },
	providers: { default: 'rethinkdb', rethinkdb: config.rethinkdb },
	typing: true
});

client.gateways.register('crews', {
	owner: {
		type: 'user',
		array: false,
		default: null
	},
	role: {
		type: 'role',
		array: false,
		default: null
	},
	members: {
		type: 'user',
		array: true,
		default: []
	}
});

client.login(config.token);
