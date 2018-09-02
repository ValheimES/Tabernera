module.exports = {
	// Importa todo de Klasa
	...require('klasa'),

	Command: require('./lib/structures/Comando'),
	util: require('./lib/util/Util'),
	constants: require('./lib/util/constants')
};
