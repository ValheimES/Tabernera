const Comando = require('../../estructuras/Comando');
const Discord = require('discord.js');

module.exports = class extends Comando {

	constructor(...args) {
		super(...args, {
			name: 'perfil',
			runIn: ['text', 'dm', 'group'],
			permLevel: 3,
			description: 'Mira el estado de tu cuenta.',
			extendedHelp: '+perfil',
			usage: '',
			comando: '+perfil'
		});
	}

	async run(msg) {
		var desc = '';
		const MySql = await this.client.providers.get('MySQL');
		if (await MySql.get('XP', 'ID', `${msg.author.id}`)) {
			const base = await MySql.get('XP', 'ID', `${msg.author.id}`);
			desc = base.XP;
		} else {
			return msg.channel.send('No tienes experiencia todavia');
		}

		var lvl = '';
		var lvlCnt = '0';
		var crrLvl = '0';

		if (parseInt(desc) >= 67525) {
			lvl = 'Rey pirata';
			lvlCnt = 'Stop';
			crrLvl = 'Stop';
		} else if (parseInt(desc) >= 23850) {
			lvl = 'Pirata experto';
			lvlCnt = '67525';
			crrLvl = String(parseInt(desc) - 23850);
		} else if (parseInt(desc) >= 11825) {
			lvl = 'Pirata rufián';
			lvlCnt = '23850';
			crrLvl = String(parseInt(desc) - 11825);
		} else if (parseInt(desc) >= 4675) {
			lvl = 'Grumete gallina';
			lvlCnt = '11825';
			crrLvl = String(parseInt(desc) - 4675);
		} else if (parseInt(desc) >= 1150) {
			lvl = 'Rata de mar';
			lvlCnt = '4675';
			crrLvl = String(parseInt(desc) - 1150);
		} else {
			lvl = 'Limpiacubiertas';
			lvlCnt = '1150';
			crrLvl = desc;
		}

		const embedSugerencia = new Discord.MessageEmbed()
			.setColor(0x3785df)
			.setTitle(`**Estado de la cuenta @${msg.author.tag}:**`)
			.addField('<:noticias:406932788428931092> **Total de experiencia:**', `\u0020 \u0020 ${desc}`, true)
			.addField('<:soporte:406932787908706316> **Nivel:**', `\u0020\u0020${lvl}`, true)
			.addField('<:flechaarriba:406932788256702474> **Siguiente nivel:**', `\u0020 \u0020 ${crrLvl}/${lvlCnt} exp.`, true)
			.addField('<:cofre:406906617284788225> **Monedas de oro:**', '\u0020 \u0020 00', true);

		msg.channel.send({ embed: embedSugerencia });
		return msg.delete(2000);
	}

};
