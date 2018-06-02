const { Command } = require('../../index');
const { MessageAttachment } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			permissionLevel: 6,
			description: 'Enviar comunicados al servidor siguiendo el formato utilizado. Parámetro opcional para añadir archivos adjuntos mediante un enlace. Posibilidad de adjuntar el archivo directamente.',
			usage: '<título:str> <descripción:str> [enlace:str]',
			extendedHelp: '+comunicado Sistema de comunicados | Añadido sistema de comunicados | https://i.imgur.com/MHbYoJT1.png',
			comando: '+comunicado <Título> | <Descripción> | [Enlace]',
			usageDelim: '|'
		});
	}

	async run(msg, [titulo, descripcion, imagen]) {
		if (!imagen && msg.attachments.size) imagen = msg.attachments.first().url;

		await msg.delete();

		const canal = msg.guild.channels.get(msg.guild.configs.channels.comunicados);
		const messageFormat = `<:logosot:418871931157086218> **${titulo.toUpperCase()}**\n\n${descripcion}\n\n[@everyone]`;
		if (imagen) return canal.send(messageFormat, new MessageAttachment(this.parseURL(imagen)));
		return canal.send(messageFormat);
	}

	parseURL(imagen) {
		try {
			const url = new URL(imagen);
			if (!/\.(png|jpg|jpeg|gif|bmp|webp)$/.test(url.pathname)) throw '';
			return imagen;
		} catch (_) {
			throw 'La URL o el archivo adjunto no es una imagen válida.';
		}
	}

};
