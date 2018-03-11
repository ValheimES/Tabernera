const Comando = require('../../estructuras/Comando');

module.exports = class extends Comando {

	constructor(...args) {
            super(...args, {
                name: 'verificar',
                runIn: ['text'],
                permLevel: 4,
                description: 'Verifica a un usuario',
                usage: '<usuario:User> <rol:str>',
                usageDelim: ' ',
                extendedHelp: '+verificar @Chorizo @Insider',
                comando: '+verificar <Usuario> <Rol>'
            });
        }

	async run(msg, [user, rol]) {

  rol = msg.guild.roles.find('name', rol);

		var taberna = this.client.channels.get("375828283704475649");

		const MySql = await this.client.providers.get('MySQL');
		
		let member = msg.mentions.members.first();

		console.log(rol);
			
		member.addRole(rol);

                await MySql.insert2("Verificacion", ['UserID', 'Rango'], [`${user.id}`, `${rol.name}`]);

		return taberna.send("<:tic:408639986934480908> **¡Cuenta verificada!:** _" + user + " , ahora puedes disfrutar de las ventajas de la verificación. Haz click aquí­ para más <#389219208799453185>._");
        
	}

};
