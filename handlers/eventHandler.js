"use strict";

const fs = require("fs");
const path = require("path");

const Logger = require("../utils/logger");

class EventHandler {

	static async load() {

		global.RIN.events.clear();

		const eventsPath = path.join(
			process.cwd(),
			"events"
		);

		const files = this.scan(eventsPath);

		for (const file of files) {

			try {

				delete require.cache[
					require.resolve(file)
				];

				const event = require(file);

				if (
					!event ||
					typeof event !== "object"
				)
					continue;

				if (!event.name) {

					Logger.warning(
						`${path.basename(file)} لا يحتوي على name`
					);

					continue;

				}

				if (
					typeof event.execute !==
					"function"
				) {

					Logger.warning(
						`${event.name} لا يحتوي على execute()`
					);

					continue;

				}

				const name =
					event.name.toLowerCase();

				if (
					global.RIN.events.has(name)
				) {

					Logger.warning(
						`الحدث ${name} مكرر`
					);

					continue;

				}

				event.filePath = file;

				global.RIN.events.set(
					name,
					event
				);

				Logger.event(name);

			}
			catch (err) {

				Logger.error(err.message);

			}

		}

		Logger.success(
			`تم تحميل ${global.RIN.events.size} حدث`
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

module.exports = EventHandler;
