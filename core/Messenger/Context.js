"use strict";

class Context {

	constructor(data = {}) {

		this.api = data.api || null;

		this.sender = data.sender || null;

		this.client = data.client || null;

		this.config = data.config || null;

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

		if (this.sender)
			return this.sender.reply(
				this.threadID,
				this.messageID,
				body
			);

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

		if (this.sender)
			return this.sender.send(
				this.threadID,
				body
			);

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

	async image(imagePath, body = "") {

		if (!this.sender)
			throw new Error("Sender غير موجود");

		return this.sender.image(
			this.threadID,
			imagePath,
			body
		);

	}

	async video(videoPath, body = "") {

		if (!this.sender)
			throw new Error("Sender غير موجود");

		return this.sender.video(
			this.threadID,
			videoPath,
			body
		);

	}

	async audio(audioPath, body = "") {

		if (!this.sender)
			throw new Error("Sender غير موجود");

		return this.sender.audio(
			this.threadID,
			audioPath,
			body
		);

	}

	async react(emoji) {

		if (this.sender)
			return this.sender.react(
				this.messageID,
				emoji
			);

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

		if (this.sender)
			return this.sender.unsend(
				this.messageID
			);

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
