const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(client, store, file, core, { comando = null, opcional = '', ...options } = {}) {
		super(client, store, file, core, options);
		this.opcional = opcional;
		Object.defineProperty(this, 'comando', { value: comando || this.client.options.prefix + this.usage });
	}

	get admins() {
		return this.permissionLevel >= 4;
	}

};
