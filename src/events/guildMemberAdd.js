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

	async run(member) {
		const role = member.guild.roles.get(member.guild.configs.roles.inicial[0]);
		if (role) await member.roles.add(role);

		const channel = member.guild.channels.get(member.guild.configs.channels.puerto);
		if (channel) {
			await channel.send(new MessageEmbed()
				.setColor(0xA79A7A)
				.setImage('https://media.giphy.com/media/3oEdU3NKj72cQr5iQo/giphy.gif')
				.setDescription([
					codeBlock('fix', '¡AHOY PIRATA!'),
					'<:barco:406838651771682818> **¡Un nuevo barco acaba de atracar en el puerto!**',
					`\n_El pirata ${member.user.username} entra de un portazo en la <#375828283704475649> sediento de una buena jarra de grog_ <:jarra:406906694766034947>`
				].join('\n'))
			);
		}
		if (member.guild.id === '420911335187152909') {
			const cuestionario = member.guild.channels.get(member.guild.configs.channels.cuestionario);
			const Usuario = 'usuario';

			const menus = [new RichMenu(),
				new RichMenu(),
				new RichMenu(),
				new RichMenu()];

			for (let i = 0; i < menus.length; i++) {
				this.añadir3Opciones(menus[i], opciones[i]);
				await this.bucle(menus[i], correctos[i], await cuestionario.send('Cargando Cuestionario'));
			}

			member.roles.add(member.guild.configs.roles[Usuario]);
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
