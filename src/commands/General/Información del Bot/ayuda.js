const { Command, util: { codeBlock, isFunction } } = require('../../../index');

const tabernera = '<:tabernera:406895006004281345>', jarra = '<:jarra:406906694766034947>', loro = '<:loro:375838594570649600>';
const easterEgg = [
	`${jarra} Sí, claramente necesitas ayuda.\nhttp://gph.is/16XYtwG`,
	`${jarra} ¿En serio acabas de poner +ayuda ayuda?`,
	`${jarra} Alguien ha tenido un día duro.\nhttp://gph.is/1bz7LSn`,
	`**Contraseña incorrecta.**\nHas llegado al sótano secreto de GamedevES. Aquí es donde jugamos a las cartas con parches de pirata.\nDesgraciadamente no puedes pasar. ${loro}`,
	`¿Y quién creó al creador?...\n¿Y quién creó al creador que creó al creador?...\n¿Y quién creó al creador que creó al creador que creó al creador?... ${jarra}`,
	`${jarra} Error. Has creado un bucle espacio-temporal.\nhttp://gph.is/1NnJLmb`,
	`${jarra} Te puedo ayudar una vez pero si son dos veces, merezco propina.`
];

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['comandos'],
			description: 'Enseña la ayuda de un comando.',
			usage: '[Command:cmd]',
			extendedHelp: '+ayuda encuesta',
			comando: '+ayuda [comando]'
		});
	}

	async run(msg, [cmd]) {
		if (cmd) {
			if (cmd.name === 'ayuda') return msg.sendMessage(`${codeBlock('fix', 'AYUDA: 2. SISTEMA — ¿AYUDA?')}\n${easterEgg[Math.floor((Math.random() * easterEgg.length) + 1)]}`);
			return msg.sendMessage([
				codeBlock('fix', `AYUDA: ${this.findCategory(cmd.category)}. ${cmd.category.toUpperCase()} — ${cmd.name.toUpperCase()}\n`),
				`${tabernera} **Comando:** \`\`${cmd.comando}\`\``,
				`${tabernera} **Descripción:** ${isFunction(cmd.description) ? cmd.description(msg) : cmd.description}`,
				`${tabernera} **Ejemplo de uso:** _${isFunction(cmd.extendedHelp) ? cmd.extendedHelp(msg) : cmd.extendedHelp}_`,
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
