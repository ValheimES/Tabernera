const { Monitor, util: { codeBlock } } = require('../index');

const ROLES = {
	REYPIRATA: '424585537035304962',
	PIRATAEXPERTO: '424585482119413760',
	PIRATA: '424585387596447765',
	GRUMETEGALLINA: '424585289852256268',
	RATADEMAR: '424585155408166922',
	LIMPIACUBIERTAS: '424585008984883203'
};
const ROLES_KEYS = Object.values(ROLES);

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, { ignoreOthers: false });
	}

	async run(msg) {
		if (!msg.guild || msg.guild.id !== '375828283184513033' || msg.channel.name === 'comandos') return;
		const base = msg.author.configs.xp;
		const next = base + 10;
		await msg.author.configs.update('xp', next);

		const memberRoles = new Set(msg.member.roles.keys()), initial = new Set(memberRoles);
		let rolename;
		if (next <= 25) {
			this.editRoles(memberRoles, ROLES.LIMPIACUBIERTAS);
			rolename = '1:** Limpiacubiertas.';
		} else if (next <= 1150) {
			this.editRoles(memberRoles, ROLES.RATADEMAR);
			rolename = '2:** Rata de mar.';
		} else if (next <= 4675) {
			this.editRoles(memberRoles, ROLES.GRUMETEGALLINA);
			rolename = '3:** Grumete gallina.';
		} else if (next <= 11825) {
			this.editRoles(memberRoles, ROLES.PIRATA);
			rolename = '4:** Pirata.';
		} else if (next <= 67525) {
			this.editRoles(memberRoles, ROLES.PIRATAEXPERTO);
			rolename = '5:** Pirata experto.';
		} else {
			this.editRoles(memberRoles, ROLES.REYPIRATA);
			rolename = '6:** Rey pirata.';
		}

		if (this.equalSets(memberRoles, initial)) return;
		await msg.member.roles.set([...memberRoles]);

		const canal = msg.guild.channels.get(msg.guild.configs.channels.actividad);
		if (canal) {
			await canal.send([
				codeBlock('fix', 'SISTEMA DE NIVELES'),
				'\n',
				`<:flechaarriba:406932788256702474> **${msg.author} ha subido de nivel.**`,
				'\n',
				`<:garfio:407239812873977857> **Nivel ${rolename}`
			].join('\n'));
		}
	}

	editRoles(set, addRole) {
		for (const role of ROLES_KEYS) set.delete(role);
		set.add(addRole);
	}

	equalSets(set1, set2) {
		if (set1.size !== set2.size) return false;
		for (const value of set1) if (!set2.has(value)) return false;
		return true;
	}

};
