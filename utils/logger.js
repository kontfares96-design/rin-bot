"use strict";

const chalk = require("chalk");

class Logger {

	static time() {

		return new Date().toLocaleTimeString("ar-DZ", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit"
		});

	}

	static log(type, color, message) {

		console.log(
			color(
				`[${this.time()}] [${type}] ${message}`
			)
		);

	}

	static info(message) {

		this.log(
			"INFO",
			chalk.cyan,
			message
		);

	}

	static success(message) {

		this.log(
			"SUCCESS",
			chalk.green,
			message
		);

	}

	static warning(message) {

		this.log(
			"WARNING",
			chalk.yellow,
			message
		);

	}

	static error(message) {

		this.log(
			"ERROR",
			chalk.red,
			message
		);

	}

	static command(name) {

		this.log(
			"COMMAND",
			chalk.magenta,
			`Loaded : ${name}`
		);

	}

	static event(name) {

		this.log(
			"EVENT",
			chalk.blue,
			`Loaded : ${name}`
		);

	}

	static system(message) {

		this.log(
			"SYSTEM",
			chalk.hex("#ff4fa3"),
			message
		);

	}

	static facebook(message) {

		this.log(
			"FACEBOOK",
			chalk.hex("#1877F2"),
			message
		);

	}

}

module.exports = Logger;
