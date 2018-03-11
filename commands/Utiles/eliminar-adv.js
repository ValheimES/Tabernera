const Comando = require('../../estructuras/Comando');

module.exports = class extends Comando {
    
        constructor(...args) {
            super(...args, {
                name: 'eliminar-adv',
                permLevel: 4,
                description: 'Elimina las advertencias de un usuario.',
                usage: '<usuario:User>',
                extendedHelp: '+eliminar-adv @Usuario',
                comando: '+eliminar-adv <Usuario>',
                opcional: ['```md',
                             `* Hay que tener precaucion con este comando.`,
                             '```']
            });
        }
    
    
        async run(msg, [usuario]) {
            const MySql = await this.client.providers.get('MySQL');

            const exists = await MySql.has2("Strikes", `${usuario.id}`);

            if (!exists) {
                msg.delete(1000);
                return msg.send("El usuario no tiene advertencias.");
            } else {
                await MySql.delete3("Strikes", usuario.id);
                msg.delete(1000);
                return msg.send("El usuario ya no tiene advertencias.");
            }
        }

};