const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(client, store, file, core, options = {}) {
		super(client, store, file, core, options);
		this.comando = options.comando || 'No definido';

		if (options.permLevel >= 4) {
			this.admins = true;
		} else {
			this.admins = false;
		}

		this.opcional = options.opcional || '';
	}

};
