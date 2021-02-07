const { Command } = require('../../index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'aceptar',
			requiredSettings: ['reportes'],
			permissionLevel: 4,
			description: 'Responde a un fallo que se ha solucionando dando una descripción y la id del mensaje.',
			usage: '<idmensaje:int>',
			usageDelim: ' ',
			extendedHelp: '+responder 378947583628938',
			comando: '+responder <idMensaje>',
			admins: true
		});
	}

	async run(msg, [id]) {
		const canal = msg.guild.channels.get(msg.guild.configs.channels.reportes);
		if (!canal || !canal.postable)
			throw 'Por favor, reestablezca un canal, ya que éste ha sido borrado o no puedo mandar mensajes en él.';

		const provider = this.client.providers.default;
		const datos = await provider.get('fallos', id);

		if (!datos) throw 'El ID del reporte no es valido';
		if (datos.aceptado) throw 'El reporte ya ha sido aceptado, para darlo por solucionado escriba +';

		msg.delete(1000);

		const user = await this.client.users.fetch(datos.id);
		const updateQuery = {};
		if (datos.numApp === 5) {
			user.send(new MessageEmbed()
				.setColor(0x3785df)
				.setAuthor(user.username, user.displayAvatarURL())
				.setTitle(datos.titulo)
				.setDescription(datos.descripcion)
				.addField('Tu fallo ha sido aceptado, se te avisara cuando este solucionado')).catch(() => null);
			updateQuery.aceptado = true;
		}

		let found;
		for (const message of (await canal.messages.fetch({ limit: 100 })).values()) {
			if (!message.embeds.length) continue;
			const [embed] = message.embeds;
			if (!embed.footer || embed.footer.text !== datos.messageID) continue;
			found = message;
			break;
		}

		if (found) {
			found.edit(new MessageEmbed().setColor(0x3785df)
				.setAuthor(user.username, user.displayAvatarURL())
				.setTitle(datos.titulo)
				.setDescription(datos.descripcion)
				.addField('Aceptado', `ID: ${id}`)
				.setFooter(datos.messageID));
		}
		updateQuery.numApp = datos.numApp + 1;
		await provider.update('fallos', id, updateQuery);

		return null;
	}

};
