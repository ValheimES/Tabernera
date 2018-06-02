const Comando = require('../../estructuras/Comando');
const Discord = require('discord.js');

module.exports = class extends Comando {

	constructor(...args) {
		super(...args, {
			name: 'reporte',
			runIn: ['text'],
			requiredSettings: ['reportes'],
			permissionLevel: 3,
			description: 'Avisa a un moderador sobre un fallo o un usuario que incumple las normas.',
			usage: '<fecha:str> <hora:str> <usuario:user> <desc:str> [...]',
			usageDelim: ' | ',
			extendedHelp: '+reporte 27/03/2018 | 14:02 | @Hero#2501 | Pruebas',
			comando: '+reporte <dd/mm/yyyy> | <hh:mm> | <@Usuario> | <Descripción>',
			opcional: ['```md',
				`* Los reportes son anónimos, no pueden ser vistos por un usuario.`,
				'```']
		});
	}

	async run(msg, [hora, hora3, usuario, ...titulodesc]) {
		const canal = msg.guild.channels.get(msg.guild.configs.reportes);

		var hora2 = hora.split('/');
		if (hora2.length !== 3)
			return msg.send('Error de formato, dd/mm/yyyy');

		if (!hora2[0].length === 2 || !hora2[1].length === 2 || !hora2[2].length === 4)
			return msg.send('Error de formato, dd/mm/yyyy');

		var hora4 = hora3.split(':');
		if (hora4.length !== 2)
			return msg.send('Error de formato, hh:mm');

		if (!hora4[0].length === 2 || !hora4[1].length === 2)
			return msg.send('Error de formato, hh:mm');


		titulodesc = `${titulodesc.join(' ')}`;

		if (!canal || canal.postable === false) return msg.send('Por favor, reestablezca un canal, ya que éste ha sido borrado o no puedo mandar mensajes en él.');
		console.log(msg.id);
		const embedReporte = new Discord.MessageEmbed()
			.setColor(0x3785df)
			.setAuthor(msg.author.username, msg.author.avatarURL())
			.addField(`**Usuario reportado:** ${usuario.tag}`, `**Descripción:** ${titulodesc}`)
			.addField(`**Fecha y hora:** ${hora} a las ${hora3}`, `**ID del reporte:** ${msg.id}`);

		msg.send('<:tic:408639986934480908> **Tu reporte ha sido enviado a moderación y está siendo revisado.**');
		canal.send('Nuevo reporte recibido:');
		msg.delete(2000);
		canal.send({ embed: embedReporte });
		canal.send('[<@&406051816950726656>]');
		return msg.author.send('✅ **Tu reporte ha sido enviado a moderación y está siendo revisado:** Cuando un moderador escoge tu caso realiza una investigación y se pone en contacto contigo por MD, asegúrate de tenerlos activados. Si en 48h no has recibido respuesta, puedes enviar de nuevo el reporte.');
	}

};
