const Comando = require('../../estructuras/Comando');
const Discord = require('discord.js');

module.exports = class extends Comando {

	constructor(...args) {
		super(...args, {
			name: 'comunicado',
			enabled: true,
			runIn: ['text'],
			permLevel: 4,
			description: 'Enviar comunicados al servidor.',
			usage: '<titulo:str> <descripcion:str> [enlace:str]',
			extendedHelp: '+comunicado',
			comando: '+comunicado',
			usageDelim: '|'
		});
	}
	async run(msg, [titulo, descripcion, imagen]) {
		const canal = msg.guild.channels.get(msg.guild.configs.comunicados);

		const messageFormat = [
			`:logosot: **${titulo.toUpperCase()}**\n`,
			descripcion,
			`\n[@everyone]`
		];

		if (!imagen && msg.attachments.size) {
			imagen = msg.attachments.first().url;
		}

		if (imagen) {
			await canal.send(messageFormat, new Discord.MessageAttachment(imagen));
		} else {
			await canal.send(messageFormat);
		}
		await msg.delete(100);

		return true;
	}

};
