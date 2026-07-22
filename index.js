"use strict";

const chalk = require("chalk");

const config = require("./config/config.json");

const CommandHandler = require("./handlers/commandHandler");
const EventHandler = require("./handlers/eventHandler");

const Messenger = require("./core/Messenger/Messenger");
const Listener = require("./core/Messenger/Listener");
const Router = require("./core/Messenger/Router");
const Sender = require("./core/Messenger/Sender");

(async () => {

	console.clear();

	console.log(
		chalk.magenta("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
	);

	console.log(
		chalk.white.bold(`🍓 ${config.bot.name}`)
	);

	console.log(
		chalk.gray(`Version : ${config.bot.version}`)
	);

	console.log(
		chalk.magenta("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
	);

	global.RIN = {
		config
	};

	await CommandHandler.load();

	await EventHandler.load();

	const messenger = new Messenger(config);

	const api = await messenger.start();

	const sender = new Sender(api);

	const listener = new Listener(api);

	const router = new Router({

		api,

		sender,

		config,

		commandHandler: CommandHandler,

		eventHandler: EventHandler

	});

	listener.on("message", event => {

		router.handle(event);

	});

	listener.start();

	console.log(
		chalk.green("✅ RIN Started Successfully")
	);

})();
