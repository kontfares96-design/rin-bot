"use strict";

const fs = require("fs");
const path = require("path");

const MenuBuilder = require("../../utils/MenuBuilder");

module.exports = {

	name: "help",
	aliases: ["menu", "commands"],

	description: "Show commands list",

	category: "system",

	async execute(ctx) {

		try {

			const commandHandler = ctx.client.commandHandler;

			const allCommands = [...commandHandler.commands.keys()]

				.sort((a, b) => a.localeCompare(b));

			const perPage = 10;

			let page = 1;

			if (ctx.args[0]) {

				const p = parseInt(ctx.args[0]);

				if (!isNaN(p) && p > 0)
					page = p;

			}

			const totalPages = Math.ceil(

				allCommands.length / perPage

			);

			if (page > totalPages)
				page = totalPages;

			const start = (page - 1) * perPage;

			const commands = allCommands.slice(

				start,

				start + perPage

			);

			const image = await MenuBuilder.build(

				commands,

				page,

				totalPages

			);

			await ctx.sender.image(

				ctx.threadID,

				image,

				""

			);

			fs.unlink(image, () => {});

		}

		catch (err) {

			console.log(err);

			await ctx.sender.reply(

				ctx.threadID,

				ctx.messageID,

				"❌ حدث خطأ أثناء إنشاء القائمة."

			);

		}

	}

};
