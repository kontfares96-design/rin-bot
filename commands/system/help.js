"use strict";

const fs = require("fs");

const MenuBuilder = require("../../utils/MenuBuilder");

module.exports = {

	name: "help",

	aliases: ["menu", "commands"],

	version: "1.0.0",

	description: "عرض قائمة الأوامر",

	category: "system",

	cooldown: 3,

	async execute(ctx) {

		try {

			const allCommands = [
				...ctx.client.commandHandler.commands.keys()
			].sort();

			const perPage = 10;

			let page = 1;

			if (ctx.args.length) {

				const input = parseInt(ctx.args[0]);

				if (!isNaN(input))
					page = input;

			}

			const totalPages = Math.max(
				1,
				Math.ceil(allCommands.length / perPage)
			);

			if (page < 1)
				page = 1;

			if (page > totalPages)
				page = totalPages;

			const start = (page - 1) * perPage;

			const commands = allCommands.slice(
				start,
				start + perPage
			);

			const imagePath = await MenuBuilder.build(
				commands,
				page,
				totalPages
			);

			await ctx.image(imagePath);

			fs.unlink(imagePath, () => {});

		}
		catch (err) {

			console.error(err);

			await ctx.reply(
				"❌ حدث خطأ أثناء إنشاء قائمة الأوامر."
			);

		}

	}

};
