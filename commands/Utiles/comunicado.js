const Comando = require('../../estructuras/Comando');
const Discord = require('discord.js');

module.exports = class extends Comando {

	constructor(...args) {
		super(...args, {
			name: 'comunicado',
			enabled: true,
			runIn: ['text'],
			permLevel: 6,
			description: 'Enviar comunicados al servidor siguiendo el formato utilizado. Parámetro opcional para añadir archivos adjuntos mediante un enlace. Posibilidad de adjuntar el archivo directamente.',
			usage: '<título:str> <descripción:str> [enlace:str]',
			extendedHelp: '+comunicado Sistema de comunicados | Añadido sistema de comunicados | https://imgur.com/a/9K6SX',
			comando: '+comunicado <Título> | <Descripción> | [Enlace]',
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
