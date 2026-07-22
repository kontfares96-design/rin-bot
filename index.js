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

	console.log(chalk.magenta("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
	console.log(chalk.white.bold(`🍓 ${config.bot.name}`));
	console.log(chalk.gray(`Version : ${config.bot.version}`));
	console.log(chalk.gray(`Prefix : ${config.bot.prefix}`));
	console.log(chalk.gray(`Language : ${config.bot.language}`));
	console.log(chalk.magenta("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

	global.RIN = {
		config,
		startTime: Date.now(),
		commands: new Map(),
		events: new Map()
	};

	try {

		console.log(chalk.cyan("Loading Commands..."));
		await CommandHandler.load();

		console.log(chalk.cyan("Loading Events..."));
		await EventHandler.load();

		console.log(chalk.cyan("Connecting Facebook..."));

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

		listener.on("message", async (event) => {
			await router.handle(event);
		});

		listener.start();

		console.log(chalk.green("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
		console.log(chalk.green("RIN [🍓] Online Successfully"));
		console.log(chalk.yellow(`Commands : ${global.RIN.commands.size}`));
		console.log(chalk.yellow(`Events   : ${global.RIN.events.size}`));
		console.log(chalk.green("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

	}
	catch (err) {

		console.error(err);

		process.exit(1);

	}

})();
