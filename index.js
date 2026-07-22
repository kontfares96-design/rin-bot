"use strict";

const fs = require("fs");
const path = require("path");

const chalk = require("chalk");

const CommandHandler = require("./handlers/commandHandler");
const EventHandler = require("./handlers/eventHandler");

const config = require("./config/config.json");

console.clear();

console.log(
	chalk.hex("#ff4fa3")("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
);
console.log(
	chalk.white.bold(`🍓 ${config.bot.name}`)
);
console.log(
	chalk.gray(`Version : ${config.bot.version}`)
);
console.log(
	chalk.gray(`Language : ${config.bot.language}`)
);
console.log(
	chalk.gray(`Timezone : ${config.bot.timezone}`)
);
console.log(
	chalk.hex("#ff4fa3")("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
);

global.RIN = {
	config,
	startTime: Date.now(),
	commands: new Map(),
	events: new Map()
};

async function bootstrap() {

	try {

		console.log(
			chalk.cyan("➜ Loading Commands...")
		);

		await CommandHandler.load();

		console.log(
			chalk.cyan("➜ Loading Events...")
		);

		await EventHandler.load();

		console.log(
			chalk.green("✔ Framework Ready")
		);

		console.log("");

		console.log(
			chalk.yellow(
				`Commands : ${global.RIN.commands.size
