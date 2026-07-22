"use strict";

const Parser = require("./Parser");
const Context = require("./Context");
const Logger = require("../../utils/logger");

class Router {

	constructor(client) {

		this.client = client;
		this.parser = new Parser(client.config);

	}

	async handle(event) {

		try {

			const data = this.parser.parse(event);

			if (!data || !data.isCommand)
				return;

			const command =
				this.client.commandHandler.commands.get(
					data.command.toLowerCase()
				);

			if (!command) {

				Logger.warning(
					`Command not found: ${data.command}`
				);

				return;

			}

			const ctx = new Context({

				api: this.client.api,
				sender: this.client.sender,
				client: this.client,
				config: this.client.config,

				event,

				body: data.body,
				command: data.command,
				args: data.args,

				prefix: data.prefix,

				threadID: data.threadID,
				senderID: data.senderID,
				messageID: data.messageID,

				mentions: data.mentions,
				attachments: data.attachments,
				timestamp: data.timestamp

			});

			await command.execute(ctx);

			Logger.info(
				`${ctx.senderID} → ${ctx.command}`
			);

		}
		catch (err) {

			Logger.error(err.stack || err.message);

		}

	}

}

module.exports = Router;
