"use strict";

module.exports = {
	name: "message",

	description: "Message Event",

	async execute({ api, event, router }) {

		try {

			if (!event) return;

			if (!event.body && !event.attachments) return;

			await router.handle(event);

		}
		catch (err) {

			console.error("[MESSAGE EVENT]", err);

		}

	}

};
