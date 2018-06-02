const { Command, Timestamp, TaberneraUtil: { validaFecha, validaHora } } = require('../../index');
const { MessageEmbed } = require('discord.js');

const ts = new Timestamp('DD/MM/YYYY [a las] hh:mm');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'reporte',
			runIn: ['text'],
			requiredSettings: ['reportes'],
			permissionLevel: 3,
			description: 'Avisa a un moderador sobre un fallo o un usuario que incumple las normas.',
			usage: '<fecha:str> <hora:str> <usuario:user> <desc:str> [...]',
			usageDelim: '|',
			extendedHelp: '+reporte 27/03/2018 | 14:02 | @Hero#2501 | Pruebas',
			comando: '+reporte <dd/mm/yyyy> | <hh:mm> | <@Usuario> | <Descripción>',
			opcional: ['```md',
				`* Los reportes son anónimos, no pueden ser vistos por un usuario.`,
				'```']
		});
	}

	async run(msg, [fecha, hora, usuario, ...titulodesc]) {
		const canal = msg.guild.channels.get(msg.guild.configs.channels.reportes);
		if (!canal || !canal.postable) throw 'Por favor, reestablezca un canal, ya que éste ha sido borrado o no puedo mandar mensajes en él.';

		const fechaYHora = ts.display(new Date(validaFecha(fecha).concat(validaHora(hora))));

		msg.sendMessage('<:tic:408639986934480908> **Tu reporte ha sido enviado a moderación y está siendo revisado.**');
		msg.delete(2000);

		await canal.send('Nuevo reporte recibido:', new MessageEmbed()
			.setColor(0x3785df)
			.setAuthor(msg.author.username, msg.author.avatarURL())
			.addField(`**Usuario reportado:** ${usuario.tag}`, `**Descripción:** ${titulodesc.join('|')}`)
			.addField(`**Fecha y hora:** ${fechaYHora}`, `**ID del reporte:** ${msg.id}`));
		await canal.send('[<@&406051816950726656>]');
		return msg.author.send('✅ **Tu reporte ha sido enviado a moderación y está siendo revisado:** Cuando un moderador escoge tu caso realiza una investigación y se pone en contacto contigo por MD, asegúrate de tenerlos activados. Si en 48h no has recibido respuesta, puedes enviar de nuevo el reporte.').catch(() => null);
	}

};
