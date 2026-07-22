"use strict";

const {
	createCanvas,
	loadImage,
	GlobalFonts
} = require("@napi-rs/canvas");

const fs = require("fs-extra");
const path = require("path");

class CanvasManager {

	constructor() {

		this.width = 900;
		this.height = 1100;

	}

	async load(file) {

		return await loadImage(file);

	}

	async save(canvas, output) {

		await fs.ensureDir(path.dirname(output));

		await fs.writeFile(
			output,
			await canvas.encode("png")
		);

		return output;

	}

	create(width = this.width, height = this.height) {

		const canvas = createCanvas(width, height);

		const ctx = canvas.getContext("2d");

		return {
			canvas,
			ctx
		};

	}

	fill(ctx, color) {

		ctx.fillStyle = color;

		ctx.fillRect(

			0,
			0,
			ctx.canvas.width,
			ctx.canvas.height

		);

	}

	text(
		ctx,
		text,
		x,
		y,
		size = 32,
		color = "#ffffff",
		align = "left",
		font = "Arial"
	) {

		ctx.font = `${size}px ${font}`;

		ctx.fillStyle = color;

		ctx.textAlign = align;

		ctx.fillText(text, x, y);

	}

	roundRect(
		ctx,
		x,
		y,
		w,
		h,
		r,
		color
	) {

		ctx.beginPath();

		ctx.moveTo(x + r, y);

		ctx.arcTo(x + w, y, x + w, y + h, r);

		ctx.arcTo(x + w, y + h, x, y + h, r);

		ctx.arcTo(x, y + h, x, y, r);

		ctx.arcTo(x, y, x + w, y, r);

		ctx.closePath();

		ctx.fillStyle = color;

		ctx.fill();

	}

	async drawImage(
		ctx,
		image,
		x,
		y,
		w,
		h
	) {

		const img = await loadImage(image);

		ctx.drawImage(

			img,

			x,
			y,
			w,
			h

		);

	}

	async menuBackground(ctx) {

		const backgrounds = await fs.readdir(

			path.join(process.cwd(), "assets/menu")

		);

		if (!backgrounds.length)
			return;

		const random = backgrounds[
			Math.floor(Math.random() * backgrounds.length)
		];

		const img = await loadImage(

			path.join(
				process.cwd(),
				"assets/menu",
				random
			)

		);

		ctx.drawImage(

			img,

			0,
			0,

			ctx.canvas.width,

			ctx.canvas.height

		);

	}

}

module.exports = new CanvasManager();
