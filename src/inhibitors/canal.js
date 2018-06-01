const { Inhibitor } = require('../index');

module.exports = class extends Inhibitor {

	constructor(...args) {
		super(...args, { spamProtection: true });
	}

	async run(msg) {
		if (!msg.author.bot && !msg.guild.configs.channels.activados.includes(msg.channel.id))
			throw 'No se pueden enviar comandos a este canal.';
	}

};
