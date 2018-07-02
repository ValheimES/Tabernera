/* eslint no-constant-condition: ["error", { "checkLoops": false }] */

const { Event, util: { codeBlock } } = require('../index');
const { MessageEmbed } = require('discord.js');
const { RichMenu } = require('klasa');

const opciones = [['Pedir el rol a un administrador por MD.',
	'Publicar un mensaje en el foro y en Discord.',
	'Dejar un mensaje en Discord.'],
['+busco',
	'+barcosbarcos',
	'+cerveza'],
['¿Se deben envíar Mensajes Directos a los staffs?',
	'No, a menos que sea muy urgente.',
	'Si, en cualquier circunstancia.'],
['¿Se deben envíar Mensajes Directos a los staffs?',
	'No, a menos que sea muy urgente.',
	'Si, en cualquier circunstancia.']];

const correctos = [1, 0, 1, 1];

module.exports = class extends Event {

	async run(guild, user) {
		const channel = guild.channels.get(guild.configs.channels.puerto);
		if (channel) {
			channel.send(new MessageEmbed()
				.setColor(0xFF0D00)
				.setImage('https://media.giphy.com/media/l41ovTcnPgjk6rzb2/giphy.gif')
				.setDescription([
					codeBlock('fix', 'PASEÓ POR LA PLANCHA'),
					'<:barco:406838651771682818> **¡Alto ahí! Más os vale saltar por la borda**',
					`\n_El pirata ${user.username} es condenado a criar malvas devorado por los tiburones por traidor. Sus restos son recuperados y usados para decorar la <#375828283704475649>._ 🦈`
				].join('\n'))
			);
		}

		if (guild.id === '420911335187152909') {
			const cuestionario = guild.channels.get(guild.configs.channels.cuestionario);
			const miembro = guild.members.get(user.id);
			const Usuario = 'usuario';

			const menus = [new RichMenu(),
				new RichMenu(),
				new RichMenu(),
				new RichMenu()];

			for (let i = 0; i < menus.length; i++) {
				this.añadir3Opciones(menus[i], opciones[i]);
				await this.bucle(menus[i], correctos[i], await cuestionario.send('Cargando Cuestionario'));
			}

			miembro.roles.add(guild.configs.roles[Usuario]);
		}

		return true;
	}

	añadir3Opciones(menu, opc) {
		menu.addOption('1)', opc[0]);
		menu.addOption('2)', opc[1]);
		menu.addOption('3)', opc[2]);
	}

	async bucle(menu, numero, mensaje) {
		while (true) {
			const collector = await menu.run(mensaje);

			const choice = await collector.selection;
			if (choice === null)
				return collector.message.delete();

			if (choice === numero)
				break;
		}

		return true;
	}

};
