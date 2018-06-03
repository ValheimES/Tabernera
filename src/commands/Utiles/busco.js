const { Command } = require('../../index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 3,
			cooldown: 15,
			requiredSettings: ['busco'],
			usage: '[Descripcion:str]',
			description: 'Pide que se unan a tu tripulación, con el parámetro opcional de descripción, puedes añadir más información.',
			extendedHelp: '+busco En esta partida de 15:00 a 16:30 vamos a hacer una incursión y a grabar un directo mientras jugamos, así que buscamos a alguien disponible durante ese horario y que de su consentimiento a la grabación.',
			comando: '+busco [Descripción]'
		});
	}

	async run(msg, [descripcion]) {
		const { voiceChannel } = msg.member;
		if (!voiceChannel) throw `**${msg.author} debes conectarte a un barco para pedir tripulación.** 🚢`;
		if (voiceChannel.full) throw `**${msg.author} no puedes pedir más tripulantes ¡tu barco ya está lleno!** 🚫`;

		const usuariosNecesarios = voiceChannel.userLimit - voiceChannel.members.size;
		const canal = msg.guild.channels.get(msg.guild.configs.channels.busco);

		const { url } = await voiceChannel.createInvite();

		const embedBarco = new MessageEmbed()
			.setTitle('Click aqui para zarpar')
			.setAuthor(msg.member.displayName, msg.author.displayAvatarURL())
			.setURL(url)
			.setColor(0x00ced1)
			.setDescription(`Busco **${usuariosNecesarios}** ${usuariosNecesarios === 1 ? 'pirata' : 'piratas'} en el barco **${voiceChannel.name}** para zarpar.`);

		if (descripcion) embedBarco.addField('Descripción', `_${descripcion}_`);

		msg.delete(1000);
		return canal.send('[<@&430418605423853568>]', embedBarco);
	}

};
