"use strict";

const fs = require("fs");

class Sender {

	constructor(api) {

		this.api = api;

	}

	send(threadID, body, attachment = null, replyTo = null) {

		return new Promise((resolve, reject) => {

			const message = { body };

			if (attachment)
				message.attachment = attachment;

			this.api.sendMessage(
				message,
				threadID,
				(err, info) => {

					if (err)
						return reject(err);

					resolve(info);

				},
				replyTo
			);

		});

	}

	reply(threadID, messageID, body, attachment = null) {

		return this.send(
			threadID,
			body,
			attachment,
			messageID
		);

	}

	image(threadID, imagePath, body = "", replyTo = null) {

		return this.send(

			threadID,

			body,

			fs.createReadStream(imagePath),

			replyTo

		);

	}

	video(threadID, videoPath, body = "", replyTo = null) {

		return this.send(

			threadID,

			body,

			fs.createReadStream(videoPath),

			replyTo

		);

	}

	audio(threadID, audioPath, body = "", replyTo = null) {

		return this.send(

			threadID,

			body,

			fs.createReadStream(audioPath),

			replyTo

		);

	}

	file(threadID, filePath, body = "", replyTo = null) {

		return this.send(

			threadID,

			body,

			fs.createReadStream(filePath),

			replyTo

		);

	}

	react(messageID, emoji) {

		return new Promise((resolve, reject) => {

			this.api.setMessageReaction(

				emoji,

				messageID,

				err => {

					if (err)
						return reject(err);

					resolve(true);

				},

				true

			);

		});

	}

	unsend(messageID) {

		return new Promise((resolve, reject) => {

			this.api.unsendMessage(

				messageID,

				err => {

					if (err)
						return reject(err);

					resolve(true);

				}

			);

		});

	}

	changeNickname(threadID, userID, nickname) {

		return new Promise((resolve, reject) => {

			this.api.changeNickname(

				nickname,

				threadID,

				userID,

				err => {

					if (err)
						return reject(err);

					resolve(true);

				}

			);

		});

	}

}

module.exports = Sender;
