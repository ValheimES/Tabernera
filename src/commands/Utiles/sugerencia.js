const { Command } = require('../../index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'sugerencia',
			runIn: ['text'],
			permissionLevel: 3,
			requiredSettings: ['channels.sugerencias'],
			description: 'Escribe una sugerencia en el canal que hallas selceccionado en la configuración.',
			extendedHelp: '+sugerencia Titulo | Descripción',
			usage: '<titulo:str> <descripcion:str> [...]',
			usageDelim: '|',
			comando: '+sugerencia  <Titulo> | <Descripción>'
		});
	}

	async run(msg, [titulo, ...descripcion]) {
		const canal = msg.guild.channels.get(msg.guild.configs.channels.sugerencias);
		if (!canal || canal.postable === false) return msg.sendMessage('Por favor, reestablezca un canal, ya que éste ha sido borrado o no puedo mandar mensajes en él.');

		msg.delete(2000);
		await canal.send('Nueva sugerencia recibida:');

		const message = await canal.send(new MessageEmbed()
			.setColor(0x3785df)
			.setAuthor(msg.author.username, msg.author.displayAvatarURL())
			.setTitle(titulo)
			.setURL('http://gamedev.es')
			.setDescription(descripcion.join('|'))
			.setFooter(`ID: ${msg.id}`));
		await message.react('408639986934480908');
		await message.react('407160220624617484');

		return message;
	}

};
