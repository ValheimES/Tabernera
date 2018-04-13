const Comando = require('../../estructuras/Comando');
const Discord = require('discord.js');

var urlBarco;

module.exports = class extends Comando {

	constructor(...args) {
		super(...args, {
			permlevel: 3,
			cooldown: 15,
			requiredSettings: ['busco'],
			usage: '[Descripcion:str] [...]',
			description: 'Pide que se unan a tu tripulación, con el parámetro opcional de descripción, puedes añadir más información.',
			extendedHelp: '+busco En esta partida de 15:00 a 16:30 vamos a hacer una incursión y a grabar un directo mientras jugamos, así que buscamos a alguien disponible durante ese horario y que de su consentimiento a la grabación.',
			comando: '+busco [Descripción]'
		});
	}

	async run(msg, [...descripcion]) {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) { return msg.send(`**${msg.author} debes conectarte a un barco para pedir tripulación.** 🚢`); }
		if (msg.guid !== voiceChannel.guid) { return msg.send(`**${msg.author} debes conectarte a un barco para pedir tripulación.** 🚢`); }
		if (voiceChannel.full) { return msg.send(`**${msg.author} no puedes pedir más tripulantes ¡tu barco ya está lleno!** 🚫`); }

		const usuariosNecesarios = voiceChannel.userLimit - voiceChannel.members.array().length;
		const canal = msg.guild.channels.get(msg.guild.configs.busco);

		await voiceChannel.createInvite().then(invite => urlset(invite.url));

		const embedBarco = new Discord.MessageEmbed()
			.setTitle('Click aqui para zarpar')
			.setAuthor((msg.member.nickname == null) ? msg.author.username : msg.member.nickname, msg.author.avatarURL())
			.setURL(urlBarco)
			.setColor(0x00ced1)
			.setDescription(`Busco **${usuariosNecesarios}** ${usuariosNecesarios === 1 ? 'pirata' : 'piratas'} en el barco **${voiceChannel.name}** para zarpar.`);

		if (typeof descripcion[0] != 'undefined' && descripcion[0])
			embedBarco.addField('Descripción', `_${descripcion}_`);

		canal.send(embedBarco);
		msg.delete(1000);
		return canal.send('[<@&430418605423853568>]');
	}

};

async function urlset(url) {
	urlBarco = url;
};
