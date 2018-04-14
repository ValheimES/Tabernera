const Comando = require('../../estructuras/Comando');

module.exports = class extends Comando {
    
        constructor(...args) {
            super(...args, {
                name: 'quitar-adv',
                permLevel: 4,
                description: 'Elimina las advertencias de un usuario.',
                usage: '<usuario:User> <numero:str>',
                extendedHelp: '+quitar-adv @Usuario 1',
                comando: '+quitar-adv <Usuario> <Numero de advertencia>'
            });
        }
    
    
        async run(msg, [usuario, numero]) {
            const MySql = await this.client.providers.get('MySQL');

            const exists = await MySql.has2("Strikes", `${usuario.id}`);

            if (!exists) {
                msg.delete(1000);
                return msg.send("El usuario no tiene advertencias.");
            } else {
                const base = await MySql.get("Strikes", "UserID", usuario.id);
                numeroAdv = base.Numero;
                var usuarioPorID = await this.client.users.fetch(base.UserID);
                
                if(base.Numero > numero && numero == "2" && base.Numero == "3") {
                    var var2 = await MySql.get("Strikes", "UserID" , "" + usuario.id);
                    var Desc3 = var2.Desc3;
                    
                    await MySql.update2("Strikes", "" + usuario.id, "Numero", "" + 2) && await MySql.update2("Strikes", "" + usuario.id, "Desc2", `${Desc3}`) && await MySql.update2("Strikes", "" + usuario.id, "Desc3", "");
            
                } else if(base.Numero > numero && numero == "1" && base.Numero == "3") {
                    var var2 = await MySql.get("Strikes", "UserID" , "" + usuario.id);
                    var Desc3 = var2.Desc3;
                    var Desc2 = var2.Desc2;
                    
                    await MySql.update2("Strikes", "" + usuario.id, "Numero", "" + 2) && await MySql.update2("Strikes", "" + usuario.id, "Desc1", `${Desc2}`) && await MySql.update2("Strikes", "" + usuario.id, "Desc2", `${Desc3}`) && await MySql.update2("Strikes", "" + usuario.id, "Desc3", "");
                } else if (base.Numero == "3") {
                    MySql.update2("Strikes", "" + usuario.id, "Numero", "" + 2) && await MySql.update2("Strikes", "" + usuario.id, "Desc3", "");
                } else if(base.Numero > numero && numero == "2" && base.Numero == "2") {
                    await MySql.update2("Strikes", "" + usuario.id, "Numero", "" + 1) && await MySql.update2("Strikes", "" + usuario.id, "Desc2", "");
                } else if(base.Numero > numero && numero == "1" && base.Numero == "2") {
                    var var2 = await MySql.get("Strikes", "UserID" , "" + usuario.id);
                    var Desc2 = var2.Desc2;
                    
                    await MySql.update2("Strikes", "" + usuario.id, "Numero", "" + 1) && await MySql.update2("Strikes", "" + usuario.id, "Desc1", `${Desc2}`);
                } else {
                    await MySql.delete3("Strikes", "" + usuario.id);
                }
                
                msg.delete(1000);
                return msg.send("Se ha eliminado la advertencia.");
            }
        }

};