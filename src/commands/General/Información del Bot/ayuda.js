const { Command, util: { codeBlock, isFunction } } = require('klasa');
const { constants: { EMOJIS: { TABERNERA, JARRA, LORO } } } = require('../../../index');

const easterEgg = [
	`${JARRA} Sí, claramente necesitas ayuda.\nhttp://gph.is/16XYtwG`,
	`${JARRA} ¿En serio acabas de poner +ayuda ayuda?`,
	`${JARRA} Alguien ha tenido un día duro.\nhttp://gph.is/1bz7LSn`,
	`**Contraseña incorrecta.**\nHas llegado al sótano secreto de GamedevES. Aquí es donde jugamos a las cartas con parches de pirata.\nDesgraciadamente no puedes pasar. ${LORO}`,
	`¿Y quién creó al creador?...\n¿Y quién creó al creador que creó al creador?...\n¿Y quién creó al creador que creó al creador que creó al creador?... ${JARRA}`,
	`${JARRA} Error. Has creado un bucle espacio-temporal.\nhttp://gph.is/1NnJLmb`,
	`${JARRA} Te puedo ayudar una vez pero si son dos veces, merezco propina.`
];

module.exports = class extends Command {

	constructor(client, store, file, directory) {
		super(client, store, file, directory, {
			aliases: ['comandos'],
			description: 'Enseña la ayuda de un comando.',
			usage: '[Command:cmd]',
			extendedHelp: '+ayuda encuesta'
		});
	}

	async run(msg, [cmd]) {
		if (cmd) {
			if (cmd.name === 'ayuda') return msg.sendMessage(`${codeBlock('fix', 'AYUDA: 2. SISTEMA — ¿AYUDA?')}\n${easterEgg[Math.floor((Math.random() * easterEgg.length) + 1)]}`);
			return msg.sendMessage([
				codeBlock('fix', `AYUDA: ${this.findCategory(cmd.category)}. ${cmd.category.toUpperCase()} — ${cmd.name.toUpperCase()}\n`),
				`${TABERNERA} **Comando:** \`\`${cmd.comando}\`\``,
				`${TABERNERA} **Descripción:** ${isFunction(cmd.description) ? cmd.description(msg) : cmd.description}`,
				`${TABERNERA} **Ejemplo de uso:** _${isFunction(cmd.extendedHelp) ? cmd.extendedHelp(msg) : cmd.extendedHelp}_`,
				cmd.admins ? `\n${codeBlock('md', '* Función reservada sólo para administradores')}` : ''
			].join('\n'));
		}

		return msg.sendMessage(await this.buildHelpList(msg));
	}

	async buildHelpList(msg) {
		const categories = new Map();
		await Promise.all(this.client.commands.map((command) => this.client.inhibitors.run(msg, command, true)
			.then(() => {
				if (!categories.has(command.category)) categories.set(command.category, [command.name]);
				else categories.get(command.category).push(command.name);
			}).catch(() => {
				// noop
			})));

		let i = 1;
		const output = [
			'< AYUDA: RESUMEN GENERAL >',
			'',
			'# Consejo',
			'> Usa +ayuda <comando> para obtener más información de un comando específico, por ejemplo +ayuda estado.',
			''
		];
		for (const [category, commands] of categories) output.push(`${i++}. ${category.toUpperCase()} — ${commands.join(', ')}`);
		return codeBlock('md', output.join('\n'));
	}

	findCategory(category) {
		const categories = new Set();
		for (const command of this.client.commands.values()) {
			if (command.category === category) break;
			categories.add(command.category);
		}

		return categories.size + 1;
	}

};
