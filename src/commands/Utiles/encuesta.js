const { Command } = require('../../index');
const { MessageEmbed } = require('discord.js');

const numbers = Array.from({ length: 9 }, (_, i) => `${i + 1}\u20e3`);
const letters = Array.from({ length: 20 }, (_, i) => `\ud83c${String.fromCodePoint(56806 + i)}`);

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'encuesta',
			runIn: ['text'],
			description: 'Sirve para generar una encuesta automática en el canal de comunicados. Máximo 20 opciones.',
			usage: '<numeros|letras> <parametros:str> [...]',
			permissionLevel: 6,
			extendedHelp: '+encuesta numeros | Elige un color | ¿Qué color te gusta más? | Azul | Rojo | Verde | Amarillo',
			usageDelim: ' ',
			comando: '+encuesta <numeros/letras> | <Título> | <Descripción> | <Opción1> | <Opción2>',
			admins: true
		});
	}

	async run(msg, [tipo, ...parametros]) {
		msg.delete(100);
		const canal = msg.guild.channels.get(msg.guild.configs.channels.comunicados);
		if (!canal || !canal.postable)
			throw 'Por favor, reestablezca un canal de comunicados, ya que éste ha sido borrado o no puedo mandar mensajes en él.';

		const [titulo, descripcion, ...partes] = parametros.join(' ').split('|');

		if (tipo === 'numeros' && partes.length > 9) throw '¡No puedes seleccionar un número de opciones mayor de 9 cuando estás usando una encuesta con números!';

		const emojiSet = tipo === 'numeros' ? numbers : letters;
		const embed = new MessageEmbed()
			.setColor(0xee4646)
			.setTitle(titulo)
			.setDescription(descripcion)
			.setTimestamp()
			.setFooter(`seaofthieves-es.com`);

		for (let i = 0; i < partes.length; i++) embed.addField('\u200b', `${emojiSet[i]} ${partes[i]}`);

		const message = await canal.send('@everyone', embed);
		for (let i = 0; i < partes.length; i++) await message.react(emojiSet);

		return message;
	}

};
