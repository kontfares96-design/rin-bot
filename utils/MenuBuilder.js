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

		// عرض 10 أوامر فقط
		const maxCommands = 10;
		commands = commands.slice(0, maxCommands);

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

		// عدد الأوامر
		Canvas.text(
			ctx,
			`Commands : ${commands.length}`,
			450,
			660,
			22,
			"#a8a8a8",
			"center"
		);

		// رقم الصفحة
		Canvas.text(
			ctx,
			`〈 Page ${page}/${totalPages} 〉`,
			450,
			710,
			34,
			"#ffffff",
			"center"
		);

		// خط فاصل
		ctx.beginPath();
		ctx.strokeStyle = "#444444";
		ctx.lineWidth = 2;
		ctx.moveTo(100, 735);
		ctx.lineTo(800, 735);
		ctx.stroke();

		// صورة الأنمي
		const menuFolder = path.join(
			process.cwd(),
			"assets",
			"menu"
		);

		if (await fs.pathExists(menuFolder)) {

			const images = (await fs.readdir(menuFolder)).filter(file =>
				/\.(png|jpg|jpeg|webp)$/i.test(file)
			);

			if (images.length > 0) {

				const randomImage =
					images[Math.floor(Math.random() * images.length)];

				await Canvas.drawImage(
					ctx,
					path.join(menuFolder, randomImage),
					70,
					760,
					760,
					300
				);

			}

		}

		// حفظ الصورة
		const output = path.join(
			process.cwd(),
			"cache",
			`menu_${page}_${Date.now()}.png`
		);

		await Canvas.save(canvas, output);

		return output;

	}

}

module.exports = new MenuBuilder();
