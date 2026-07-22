"use strict";

class Parser {

	constructor(config = {}) {

		this.config = config;

		this.prefix =
			config?.bot?.prefix || "/";

	}

	parse(event = {}) {

		const body =
			typeof event.body === "string"
				? event.body.trim()
				: "";

		const isCommand =
			body.startsWith(this.prefix);

		let command = null;
		let args = [];

		if (isCommand) {

			const content = body
				.slice(this.prefix.length)
				.trim();

			if (content.length > 0) {

				const parts = content.split(/\s+/);

				command = (
					parts.shift() || ""
				).toLowerCase();

				args = parts;

			}

		}

		return {

			raw: event,

			type:
				event.type || "message",

			body,

			prefix: this.prefix,

			isCommand,

			command,

			args,

			threadID:
				event.threadID || null,

			senderID:
				event.senderID || null,

			messageID:
				event.messageID || null,

			replyTo:
				event.messageReply || null,

			mentions:
				event.mentions || {},

			attachments:
				event.attachments || [],

			timestamp:
				event.timestamp || Date.now()

		};

	}

}

module.exports = Parser;
