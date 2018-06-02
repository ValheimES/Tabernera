const { Command } = require('../../index');
const { MessageEmbed } = require('discord.js');

const a = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const b = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const unicode = ['', '🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'encuesta',
			runIn: ['text'],
			description: 'Sirve para generar una encuesta automática en el canal de comunicados. Máximo 20 opciones.',
			usage: '<bool:str> <numop:int{1,20}> <parametros:str> [...]',
			permissionLevel: 6,
			extendedHelp: '+encuesta numeros 4 | Elige un color | ¿Qué color te gusta más? | Azul | Rojo | Verde | Amarillo',
			usageDelim: ' ',
			comando: '+encuesta  <numeros/letras> <cantidad de opciones> | <Título> | <Descripción> | <Opción1> | <Opción2>',
			admins: true
		});
	}

	async run(msg, [bool, numop, ...parametros]) {
		const canal = msg.guild.channels.get(msg.guild.configs.channels.comunicados);

		parametros = `${parametros.join(' ')}`;
		var partes = parametros.split('|');

		const titulo = partes[1];
		const desc = partes[2];

		if (numop <= 9 && bool === 'numeros') {
			const embedEncuesta = new MessageEmbed()
				.setColor(0xee4646)
				.setTitle(`${titulo}`)
				.setDescription(`${desc}`)
				.setTimestamp(new Date())
				.setFooter(`seaofthieves-es.com`);

			for (let i = 1; i < (numop + 1); i++)
				embedEncuesta.addField('\u200b', `:${inWords(true, i)}: ${partes[i + 2]}`);

			embedEncuesta.addField('\u200b', `@everyone`);

			canal.send(embedEncuesta).then(async (message) => {
				for (var i = 1; i < (numop + 1); i++)
					await message.react(`${i}\u20e3`);
			});
			await msg.delete(100);
		} else {
			const embedEncuesta2 = new MessageEmbed()
				.setColor(0xee4646)
				.setTitle(`${titulo}`)
				.setDescription(`${desc}`)
				.setTimestamp(new Date())
				.setFooter(`seaofthieves-es.com`);

			for (let i = 1; i < (numop + 1); i++)
				embedEncuesta2.addField('\u200b', `:regional_indicator_${inWords(false, i)}: ${partes[i + 2]}`);

			embedEncuesta2.addField('\u200b', `@everyone`);

			canal.send(embedEncuesta2).then(async (message) => {
				for (let i = 1; i < (numop + 1); i++)
					await message.react(`${unicode[i]}`);
			});
			await msg.delete(100);
		}
		return true;
	}

};

function inWords(ifNum, num) {
	if (ifNum)
		return a[num];
	else
		return b[num];
}
