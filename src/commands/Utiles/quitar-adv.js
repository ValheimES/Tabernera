const { Command } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 5,
			description: 'Elimina las advertencias de un usuario.',
			usage: '<usuario:user> <todos|numero:number{1,3}>',
			extendedHelp: '+quitar-adv @Usuario 1',
			comando: '+quitar-adv <Usuario> <Numero de advertencia>'
		});
	}

	async run(msg, [usuario, numero]) {
		msg.delete(1000);

		const provider = this.client.providers.default;
		const data = await provider.get('strikes', usuario.id);
		if (!data) throw 'El usuario no tiene advertencias.';
		if (numero === 'todos') {
			await provider.delete('strikes', usuario.id);
			return msg.sendMessage(`Se han eliminado ${data.numero} ${data.numero === '1' ? 'advertencia' : 'advertencias'}.`);
		}

		if (numero > data.numero)
			throw `La advertencia ${numero} no existe.`;

		const descripciones = [data.desc1, data.desc2, data.desc3];
		descripciones.splice(numero, 1);
		descripciones.push(null);
		await provider.update('strikes', usuario.id, { numero: data.numero - 1, desc1: descripciones[0], desc2: descripciones[1], desc3: descripciones[2] });

		return msg.sendMessage('Se ha eliminado la advertencia.');
	}


};
