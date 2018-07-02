const { Command } = require('../../index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'perfil',
			runIn: ['text', 'dm', 'group'],
			permissionLevel: 3,
			description: 'Mira el estado de tu cuenta.',
			extendedHelp: '+perfil',
			usage: '',
			comando: '+perfil'
		});
	}

	async run(msg) {
		let lvl = '', lvlCnt = '0', crrLvl = '0';
		const exp = msg.author.configs.xp;
		let dinero = msg.author.configs.dinero;

		if (exp >= 67525) {
			lvl = 'Rey pirata';
			lvlCnt = 'Stop';
			crrLvl = 'Stop';
		} else if (exp >= 23850) {
			lvl = 'Pirata experto';
			lvlCnt = '67525';
			crrLvl = exp - 23850;
		} else if (exp >= 11825) {
			lvl = 'Pirata rufián';
			lvlCnt = '23850';
			crrLvl = exp - 11825;
		} else if (exp >= 4675) {
			lvl = 'Grumete gallina';
			lvlCnt = '11825';
			crrLvl = exp - 4675;
		} else if (exp >= 1150) {
			lvl = 'Rata de mar';
			lvlCnt = '4675';
			crrLvl = exp - 1150;
		} else {
			lvl = 'Limpiacubiertas';
			lvlCnt = '1150';
			crrLvl = exp;
		}

		msg.delete(2000);
		return msg.sendEmbed(new MessageEmbed()
			.setColor(0x3785df)
			.setTitle(`**Estado de la cuenta @${msg.author.tag}:**`)
			.addField('<:noticias:406932788428931092> **Total de experiencia:**', exp, true)
			.addField('<:soporte:406932787908706316> **Nivel:**', lvl, true)
			.addField('<:flechaarriba:406932788256702474> **Siguiente nivel:**', `${crrLvl}/${lvlCnt} exp.`, true)
			.addField('<:cofre:406906617284788225> **Monedas de oro:**', dinero === 0 ? '00' : dinero, true));
	}

};
