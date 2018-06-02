const { Command } = require('../../index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'ver',
			permissionLevel: 3,
			description: 'Mira tus advertencias o las de otros.',
			usage: '<advertencias> <usuario:user>',
			usageDelim: ' ',
			extendedHelp: '+ver advertencias @Usuario',
			comando: '+ver advertencias <Usuario>',
			opcional: ['```md',
				`* Hay que tener precaucion con este comando.`,
				'```']
		});
	}


	async run(msg, [, usuario]) {
		msg.delete(1000);

		const datos = await this.client.providers.default.get('strikes', usuario.id);
		if (!datos) return msg.sendMessage('El usuario no tiene advertencias.');

		return msg.sendEmbed(new MessageEmbed()
			.setColor(0xdfbb17)
			.setAuthor(usuario.username, usuario.displayAvatarURL())
			.setTitle('Advertencias')
			.setURL('http://gamedev.es')
			.setDescription(`Aqui puedes consultar las advertencias de un usuario`)
			.addField('⚠ **Advertencia 1:**', `${datos.desc1 || 'No hay información todavía'}`)
			.addField('⚠ **Advertencia 2:**', `${datos.desc2 || 'No hay información todavía'}`)
			.addField('⚠ **Advertencia 3:**', `${datos.desc3 || 'No hay información todavía'}`)
			.setFooter(`El usuario tiene ${datos.numero} ${datos.numero > 1 ? 'advertencias' : 'advertencia'}`));
	}

};
