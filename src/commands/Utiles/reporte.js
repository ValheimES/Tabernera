const { Command } = require('../../index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'reporte',
			runIn: ['text'],
			requiredSettings: ['reportes'],
			permissionLevel: 3,
			aliases: ['reportar'],
			description: 'Avisa a un moderador sobre un fallo o un usuario que incumple las normas.',
			usage: '<usuario:user> <desc:str> [...]',
			usageDelim: '|',
			extendedHelp: '+reporte @Hero#2501 | Pruebas',
			comando: '+reporte <@Usuario> | <Descripción>',
			opcional: ['```md',
				`* Los reportes son anónimos, no pueden ser vistos por un usuario.`,
				'```']
		});
	}

	async run(msg, [usuario, ...desc]) {
		// Acquire fields we'll need later and delete the message immediately
		const { author, id, guild, channel } = msg;
		await msg.delete();

		const reportChannel = guild.channels.get(guild.configs.channels.reportes);
		if (!reportChannel)
			throw 'El canal de reportes no ha sido configurado o no existe en el servidor.';

		const description = desc.join('|');
		if (description.length > 1000)
			throw 'La descripción es demasiado larga. Por favor abrevia y nosotros te contactaremos si necesitamos más detalles.';

		await reportChannel.send('Nuevo reporte recibido:', new MessageEmbed()
			.setColor(0x3785df)
			.setAuthor(author.username, author.displayAvatarURL())
			.addField(`**ID del reporte:** ${id}`, `**Usuario reportado:** ${usuario.tag} (id: ${usuario.id})`)
			.addField(`**Descripción**`, description));

		const rolModerator = guild.roles.get(guild.configs.roles.moderador);
		if (rolModerator)
			await reportChannel.send(`[${rolModerator}]`);

		await author.send(`✅ **Tu reporte ha sido enviado a moderación y está siendo revisado:**\nCuando un moderador escoge tu caso realiza una investigación y se pone en contacto contigo por MD, asegúrate de tenerlos activados.\nLa ID de tu caso es: ${id}\nSi en 48h no has recibido respuesta, puedes enviar de nuevo el reporte.`).catch(() => null);

		const confirmationMsg = await channel.send('<:tic:408639986934480908> **Tu reporte ha sido enviado a moderación y está siendo revisado.**');
		return confirmationMsg.delete({ timeout: 5000 });
	}

};
