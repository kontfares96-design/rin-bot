"use strict";

class Context {

	constructor(data = {}) {

		this.api = data.api || null;

		this.event = data.event || null;

		this.body = data.body || "";

		this.command = data.command || null;

		this.args = data.args || [];

		this.prefix = data.prefix || "/";

		this.threadID = data.threadID || null;

		this.senderID = data.senderID || null;

		this.messageID = data.messageID || null;

		this.mentions = data.mentions || {};

		this.attachments = data.attachments || [];

		this.timestamp = data.timestamp || Date.now();

	}

	async reply(body) {

		return new Promise((resolve, reject) => {

			this.api.sendMessage(
				{ body },
				this.threadID,
				(err, info) => {

					if (err)
						return reject(err);

					resolve(info);

				},
				this.messageID
			);

		});

	}

	async send(body) {

		return new Promise((resolve, reject) => {

			this.api.sendMessage(
				{ body },
				this.threadID,
				(err, info) => {

					if (err)
						return reject(err);

					resolve(info);

				}
			);

		});

	}

	async react(emoji) {

		return new Promise((resolve, reject) => {

			this.api.setMessageReaction(
				emoji,
				this.messageID,
				err => {

					if (err)
						return reject(err);

					resolve(true);

				},
				true
			);

		});

	}

	async unsend() {

		return new Promise((resolve, reject) => {

			this.api.unsendMessage(
				this.messageID,
				err => {

					if (err)
						return reject(err);

					resolve(true);

				}
			);

		});

	}

}

module.exports = Context;
