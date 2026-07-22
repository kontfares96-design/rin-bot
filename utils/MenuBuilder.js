"use strict";

const path = require("path");
const fs = require("fs-extra");
const Canvas = require("./Canvas");

class MenuBuilder {

	async build(commands = [], page = 1, totalPages = 1) {

		const { canvas, ctx } = Canvas.create(900, 1100);

		// الخلفية
		Canvas.fill(ctx, "#1d1d1d");

		// الصندوق الرئيسي
		Canvas.roundRect(
			ctx,
			70,
			60,
			760,
			980,
			35,
			"#2b2b2b"
		);

		// العنوان
		Canvas.text(
			ctx,
			"commands list",
			450,
			120,
			42,
			"#ffffff",
			"center"
		);

		// قائمة الأوامر
		let y = 190;

		for (const cmd of commands) {

			Canvas.text(
				ctx,
				"/" + cmd,
				140,
				y,
				32,
				"#ffffff"
			);

			y += 50;

		}

		// رقم الصفحة
		Canvas.text(
			ctx,
			`< page ${page}/${totalPages} >`,
			450,
			710,
			34,
			"#ffffff",
			"center"
		);

		// صورة الأنمي

		const menuFolder = path.join(
			process.cwd(),
			"assets",
			"menu"
		);

		if (await fs.pathExists(menuFolder)) {

			const images = (await fs.readdir(menuFolder))

				.filter(file =>
					file.endsWith(".png") ||
					file.endsWith(".jpg") ||
					file.endsWith(".jpeg") ||
					file.endsWith(".webp")
				);

			if (images.length) {

				const random = images[
					Math.floor(Math.random() * images.length)
				];

				await Canvas.drawImage(

					ctx,

					path.join(menuFolder, random),

					70,
					760,

					760,
					280

				);

			}

		}

		const output = path.join(

			process.cwd(),

			"cache",

			`menu_${Date.now()}.png`

		);

		await Canvas.save(canvas, output);

		return output;

	}

}

module.exports = new MenuBuilder();
