const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const {
	prefix,
	token,
} = require('../keys.json');

// Extract the required classes from the discord.js module
const {
	Client,
	MessageAttachment,
} = require('discord.js');

// Import the native fs module
const fs = require('fs');

const {
	parse,
	pool,
	roll,
} = require('dicebag');
const logger = require('winston');

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
	colorize: true,
});
logger.level = 'debug';

const client = new Client();

client.on('ready', () => {
	{
		console.log('ready');

		client.user.setActivity('Rol Cueva', {
			type: 'PLAYING',
		});

		console.log(client.guilds.cache.map(g=>g.name));
	}
});

client.on('message', async (message) => {
	if (message.author.bot) return;

	if (message.content.startsWith('Alfred')) {
		message.reply(`Amo, deberá realizar su pedido utilizando el prefijo ${prefix}`);
	}

	if (!message.content.startsWith(prefix)) return;
	const peticion = message.content.trim().split(/ +/g);

	console.log(peticion);

	if (peticion[0] != prefix) {
		message.reply(`Amo, deberá realizar su pedido utilizando el prefijo ${prefix}`);
		return;
	}

	if (peticion[1] == '!Anunciar') {
		const canal = peticion[2];
		const canalEdit = canal.substr(2, 18);

		const channel = client.channels.cache.get(canalEdit);
		const mensaje = message.content.substr(38, message.content.length - 38);

		channel.send(mensaje);
	}

	if (peticion[1] == '!Roll') {

		if (peticion[2].toString().match(/[^\d*+d+\d*$	]/gi)) {
			console.log('no match');
			message.reply(`Error en los parámetros de tirada`);
			
		} else {

			const dados = parse(peticion[2]);

			if (dados.toString().match(/[\d*+d+\d*]$/gi)) {
				console.log('no match');
				message.reply(`${pool(dados)}`).catch('tengo un error en mis circuitos');
			} else {
				console.log('match');
				message.reply(`${pool(dados)}`).catch('tengo un error en mis circuitos');
			}
		}

	}

	peticion.forEach(function (arg) {
		if (arg == '?help') {
			console.log(message)
			message.channel.send('**' + message.author.username + '**, Revisa tus mensajes privados.');
			message.author.send(`** Comandos de Alfred
				-> ${prefix} !Roll #d#\t\t\t::Lanza unos dados {cantidad+d+dados}\n' +
				-> ${prefix} !randomPhoto\t\t\t::Reciba una imagen random\n' +
				-> ${prefix} !Reglas\t\t\t::Reciba un archivo(Experimental)\n' +
				-> ${prefix} ?help\t\t\t::Reciba este mensaje\n' +
				**Alfred Bot, Con amor ${client.guilds.cache.map(g=>g.name)}`);
		}

		if (arg == '!randomPhoto') {

			const attachment = new MessageAttachment(`https://i.picsum.photos/id/${Math.floor(Math.random() * 100) + 1}/200/200.jpg`);
			// Send the attachment in the message channel with a content
			console.log(attachment);
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
		if (arg == '!baseDeDatos') {

			consultaApi();

		}
	});

	function consultaApi() {
		const myrequest = new XMLHttpRequest();
		myrequest.onreadystatechange = function () {
			if (myrequest.status == 200 && myrequest.readyState == 4) {
				// ...do something with the response

				const obj = JSON.parse(myrequest.responseText);
				console.log(obj);
				return obj;
			}
		};
		myrequest.open('GET', 'http://localhost:3003/api/company', true);
		myrequest.send();

	}

});
client.login(token);