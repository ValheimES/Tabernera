const { Event, util: { codeBlock } } = require('../index');
const { MessageEmbed } = require('discord.js');
const { RichMenu } = require('klasa');

var menu1;
var menu2;
var menu3;
var menu4;

module.exports = class extends Event {

	run(guild, user) {
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

		if(guild.id === 420911335187152909) {
			menu1 = new RichMenu();

			let opciones = ["Pedir el rol a un administrador por MD.",
							"Publicar un mensaje en el foro y en Discord.",
							"Dejar un mensaje en Discord."];
			
			añadir3Opciones(menu1, opciones);

			while(true) {
				let collector = await menu1.run();

				let choice = await collector.selection;
				if (choice === null) {
					return collector.message.delete();
				}

				if(choice === 1)
					break;
			}

			menu2 = new RichMenu();

			let opciones2 = ["+busco",
							"+barcosbarcos",
							"+cerveza"];
			
			añadir3Opciones(menu2, opciones2);

			while(true) {
				let collector = await menu2.run();

				let choice = await collector.selection;
				if (choice === null) {
					return collector.message.delete();
				}

				if(choice === 0)
					break;
			}

			menu3 = new RichMenu();

			let opciones3 = ["¿Se deben envíar Mensajes Directos a los staffs?",
							"No, a menos que sea muy urgente.",
							"Si, en cualquier circunstancia."];
			
			añadir3Opciones(menu3, opciones3);

			while(true) {
				let collector = await menu3.run();

				let choice = await collector.selection;
				if (choice === null) {
					return collector.message.delete();
				}

				if(choice === 1)
					break;
			}

			menu4 = new RichMenu();

			let opciones4 = ["¿Se deben envíar Mensajes Directos a los staffs?",
							"No, a menos que sea muy urgente.",
							"Si, en cualquier circunstancia."];
			
			añadir3Opciones(menu4, opciones4);

			while(true) {
				let collector = await menu4.run();

				let choice = await collector.selection;
				if (choice === null) {
					return collector.message.delete();
				}

				if(choice === 1)
					break;
			}

			const miembro = guild.members.get(user.id);

			miembro.roles.add(msg.guild.configs.roles['Usuario']);
		}
	}

	añadir3Opciones(menu, opciones) {
		menu.addOption("1)", opciones[0]);
		menu.addOption("2)", opciones[1]);
		menu.addOption("3)", opciones[2]);
	}

};
