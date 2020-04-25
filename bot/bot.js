const env = require('dotenv').config();


// Extract the required classes from the discord.js module
const {
    Client,
    MessageAttachment
} = require('discord.js');

// Import the native fs module
const fs = require('fs');

const keys = require('../keys.json')
const {
    parse,
    pool,
    roll
} = require('dicebag');
let prefix = process.env.PREFIX;
let token = process.env.TOKEN;
var logger = require('winston');

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
    colorize: true
});
logger.level = 'debug';


const client = new Client()



client.on('ready', () => {
    console.log("ready");

    client.user.setActivity("Rol Cueva", {
        type: "PLAYING"
    })
});

client.on('message', async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith("Alfred")) {


    }

    if (!message.content.startsWith(prefix)) return
    var peticion = message.content.trim().split(/ +/g);

    console.log(peticion)

    if (peticion[0] != prefix) {
        message.reply(`Amo, deberá realizar su pedido utilizando el prefijo ${prefix}`)
        return
    }

    if (peticion[1] == '!Anunciar') {
        var canal = peticion[2]
        var canalEdit = canal.substr(2, 18)

        const channel = client.channels.cache.get(canalEdit);
        mensaje = message.content.substr(38, message.content.length - 38)

        channel.send(mensaje);
    }

    if (peticion[1] == '!Roll') {
        const dados = parse(peticion[2])

        console.log(roll(dados))

        console.log(pool(dados))

        message.reply(`${pool(dados)}`)

        //message.reply(mensaje);
    }



    peticion.forEach(function (arg) {
        if (arg == '?help') {
            message.channel.send('**' + message.author.username + '**, Revisa tus mensajes privados.');
            message.author.send('**COMANDOS DE ALFRED**\n```\n' +
                '-> ' + prefix + ' !Roll #d#        :: Lanza unos dados {cantidad+d+dados}\n' +
                '-> ' + prefix + ' !randomPhoto     :: Reciba una imagen random\n' +
                '-> ' + prefix + ' !Reglas          :: Reciba un archivo(Experimental)\n' +
                '-> ' + prefix + ' ?help            :: Reciba este mensaje\n' +                
                '**Alfred Bot, Con amor para la Cueva del Rol');
        }

        if (arg == '!randomPhoto') {

            const attachment = new MessageAttachment(`https://i.picsum.photos/id/${Math.floor(Math.random() * 100) + 1}/200/200.jpg`);
            // Send the attachment in the message channel with a content
            console.log(attachment)
            message.channel.send(`${message.author},`, attachment);
        }

        if (arg == '!Reglas') {
            const buffer = fs.readFileSync('./archivos/reglas.txt');

            /**
             * Create the attachment using MessageAttachment,
             * overwritting the default file name to 'memes.txt'
             * Read more about it over at
             * http://discord.js.org/#/docs/main/master/class/MessageAttachment
             */
            const attachment = new MessageAttachment(buffer, './archivos/reglas.txt');
            // Send the attachment in the message channel with a content
            message.channel.send(`${message.author}, las reglas del servidor!`, attachment);
        }
    })


})

client.login(token)