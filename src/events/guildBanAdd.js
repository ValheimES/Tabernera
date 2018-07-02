/* eslint no-constant-condition: ["error", { "checkLoops": false }] */

const { Event, util: { codeBlock } } = require('../index');
const { MessageEmbed } = require('discord.js');
const { RichMenu } = require('klasa');

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

		if (guild.id === 420911335187152909) {
			const menu = new RichMenu();

			const opciones = ['Pedir el rol a un administrador por MD.',
				'Publicar un mensaje en el foro y en Discord.',
				'Dejar un mensaje en Discord.'];

			this.añadir3Opciones(menu, opciones);

			while (true) {
				const collector = await menu.run();

				const choice = await collector.selection;
				if (choice === null)
					return collector.message.delete();

				if (choice === 1)
					break;
			}

			const menu2 = new RichMenu();

			const opciones2 = ['+busco',
				'+barcosbarcos',
				'+cerveza'];

			this.añadir3Opciones(menu2, opciones2);

			while (true) {
				const collector = await menu2.run();

				const choice = await collector.selection;
				if (choice === null)
					return collector.message.delete();

				if (choice === 0)
					break;
			}

			const menu3 = new RichMenu();

			const opciones3 = ['¿Se deben envíar Mensajes Directos a los staffs?',
				'No, a menos que sea muy urgente.',
				'Si, en cualquier circunstancia.'];

			this.añadir3Opciones(menu3, opciones3);

			while (true) {
				const collector = await menu3.run();

				const choice = await collector.selection;
				if (choice === null)
					return collector.message.delete();

				if (choice === 1)
					break;
			}

			const menu4 = new RichMenu();

			const opciones4 = ['¿Se deben envíar Mensajes Directos a los staffs?',
				'No, a menos que sea muy urgente.',
				'Si, en cualquier circunstancia.'];

			this.añadir3Opciones(menu4, opciones4);

			while (true) {
				const collector = await menu4.run();

				const choice = await collector.selection;
				if (choice === null)
					return collector.message.delete();

				if (choice === 1)
					break;
			}

			const miembro = guild.members.get(user.id);
			const Usuario = 'Usuario';
			miembro.roles.add(guild.configs.roles[Usuario]);
		}

		return true;
	}

	añadir3Opciones(menu, opciones) {
		menu.addOption('1)', opciones[0]);
		menu.addOption('2)', opciones[1]);
		menu.addOption('3)', opciones[2]);
	}

};
