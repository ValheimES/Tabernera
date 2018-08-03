const { Command, util } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 10,
			description: 'Ejecuta código en el terminal, use con PRECAUCIÓN EXTREMA.',
			usage: '<expression:str>'
		});
	}

	async run(msg, [input]) {
		const result = await util.exec(input).catch((err) => { throw err; });

		const output = result.stdout ? `**\`OUTPUT\`**${util.codeBlock('prolog', result.stdout)}` : '';
		const outerr = result.stderr ? `**\`ERROR\`**${util.codeBlock('prolog', result.stderr)}` : '';
		return msg.sendMessage([output, outerr].join('\n'));
	}

};
