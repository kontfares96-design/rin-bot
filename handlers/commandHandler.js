"use strict";

const fs = require("fs");
const path = require("path");

const Logger = require("../utils/logger");

class CommandHandler {

	static commands = new Map();

	static async load() {

		this.commands.clear();

		if (global.RIN && global.RIN.commands)
			global.RIN.commands.clear();

		const commandsPath = path.join(
			process.cwd(),
			"commands"
		);

		const files = this.scan(commandsPath);

		for (const file of files) {

			try {

				delete require.cache[
					require.resolve(file)
				];

				const command = require(file);

				if (!command || typeof command !== "object")
					continue;

				if (!command.name) {

					Logger.warning(
						`${path.basename(file)} لا يحتوي على name`
					);

					continue;

				}

				if (typeof command.execute !== "function") {

					Logger.warning(
						`${command.name} لا يحتوي على execute()`
					);

					continue;

				}

				const name = command.name.toLowerCase();

				if (this.commands.has(name)) {

					Logger.warning(
						`الأمر ${name} مكرر`
					);

					continue;

				}

				command.filePath = file;

				this.commands.set(name, command);

				if (global.RIN && global.RIN.commands)
					global.RIN.commands.set(name, command);

				Logger.command(name);

			}
			catch (err) {

				Logger.error(
					`${path.basename(file)} : ${err.stack || err.message}`
				);

			}

		}

		Logger.success(
			`تم تحميل ${this.commands.size} أمر`
		);

	}

	static get(name) {

		return this.commands.get(
			String(name).toLowerCase()
		);

	}

	static has(name) {

		return this.commands.has(
			String(name).toLowerCase()
		);

	}

	static scan(directory) {

		const results = [];

		if (!fs.existsSync(directory))
			return results;

		const items = fs.readdirSync(directory, {
			withFileTypes: true
		});

		for (const item of items) {

			const full = path.join(
				directory,
				item.name
			);

			if (item.isDirectory()) {

				results.push(
					...this.scan(full)
				);

			}
			else if (
				item.isFile() &&
				item.name.endsWith(".js")
			) {

				results.push(full);

			}

		}

		return results;

	}

}

module.exports = CommandHandler;
