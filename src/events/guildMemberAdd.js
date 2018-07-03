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
['Si, si es para pedir algo.',
	'No, a menos que sea muy urgente.',
	'Si, en cualquier circunstancia.'],
['Enfadarme.',
	'Envíar un MD a un Staff.',
	'Utilizar el servidor para preguntar.']];

const preguntas = ['¿Qué hay que hacer para verificarse?',
	'¿Qué comando se utiliza para pedir tripulación?',
	'¿Se deben enviar Mensajes Directos a los staffs?',
	'Si tengo alguna duda o petición debo:'];

const embedsMenus = [new MessageEmbed(), new MessageEmbed(),
	new MessageEmbed(), new MessageEmbed()];

const correctos = [1, 0, 1, 2];

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
			const tituloEmbed = `Rellena este formulario para poder acceder a todos los canales.`;
			const cuestionario = member.guild.channels.get(member.guild.configs.channels.cuestionario);
			const Usuario = 'usuario';

			for (let i = 0; i < embedsMenus.length; i++)
				embedsMenus[i].setColor(0x673AB7).setDescription(preguntas[i]).setTitle(tituloEmbed).setAuthor(member.user.username, member.user.avatarURL());

			const menus = [new RichMenuMod(embedsMenus[0]), new RichMenuMod(embedsMenus[1]),
				new RichMenuMod(embedsMenus[2]), new RichMenuMod(embedsMenus[3])];

			for (let i = 0; i < menus.length; i++) {
				this.añadir3Opciones(menus[i], opciones[i]);
				await this.bucle(menus[i], correctos[i], await cuestionario.send(`Rellenalo ${member}`), member.user);
			}

			member.roles.add(member.guild.configs.roles[Usuario]);
			cuestionario.send(`Ahora ${member}, ya tienes acceso a todos los canales y se te ha dado el rol ${member.guild.configs.roles[Usuario]}`);
		}

		return true;
	}

	añadir3Opciones(menu, opc) {
		for (let i = 0; i < opc.length; i++)
			menu.addOption(':', opc[i]);
	}

	async bucle(menu, numero, mensaje, usuario) {
		while (true) {
			const collector = await menu.run(mensaje);
			const choice = await collector.selection;
			if (choice === null)
				return collector.message.delete();

			if (choice === numero && collector.users.get(usuario.id) === usuario) {
				collector.message.delete();
				break;
			}
		}

		return true;
	}

};

class RichMenuMod extends RichMenu {
	/**
	 * @since 0.4.0
	 * @throws You cannot directly add pages in a RichMenu
	 */
	addPage() {
		throw new Error('You cannot directly add pages in a RichMenu');
	}

	/**
	 * Adds a MenuOption
	 * @since 0.4.0
	 * @param {string} name The name of the option
	 * @param {string} body The description of the option
	 * @param {boolean} [inline=false] Whether the option should be inline
	 * @returns {this}
	 * @chainable
	 */
	addOption(name, body, inline = false) {
		this.options.push({ name, body, inline });
		return this;
	}

	/**
	 * Runs this RichMenu
	 * @since 0.4.0
	 * @param {KlasaMessage} message A message to edit or use to send a new message with
	 * @param {RichMenuRunOptions} options The options to use with this RichMenu
	 * @returns {ReactionHandler}
	 */
	async run(message, options = {}) {
		if (!this.paginated) this._paginate();
		return super.run(message, options);
	}

	/**
	 * Determines the emojis to use in this menu
	 * @since 0.4.0
	 * @param {Emoji[]} emojis An array of emojis to use
	 * @param {boolean} stop Whether the stop emoji should be included
	 * @param {boolean} jump Whether the jump emoji should be included
	 * @param {boolean} firstLast Whether the first & last emojis should be included
	 * @returns {Emoji[]}
	 * @private
	 */
	_determineEmojis(emojis, stop, jump, firstLast) {
		emojis.push(this.emojis.zero, this.emojis.one, this.emojis.two, this.emojis.three, this.emojis.four, this.emojis.five, this.emojis.six, this.emojis.seven, this.emojis.eight, this.emojis.nine);
		if (this.options.length < 10) emojis = emojis.slice(0, this.options.length);
		return super._determineEmojis(emojis, stop, jump, firstLast);
	}

	/**
	 * Converts MenuOptions into display pages
	 * @since 0.4.0
	 * @returns {void}
	 * @private
	 */
	_paginate() {
		const page = this.pages.length;
		if (this.paginated) return null;
		super.addPage(embed => {
			for (let i = 0, option = this.options[i + (page * 10)]; i + (page * 10) < this.options.length && i < 10; i++, option = this.options[i + (page * 10)])
				embed.addField(option.name, option.body, option.inline);
			return embed;
		});
		if (this.options.length > (page + 1) * 10) return this._paginate();
		this.paginated = true;
		return null;
	}

}
