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

		// تسجيل الخطوط إذا كانت موجودة
		try {

			const fontPath = path.join(
				process.cwd(),
				"assets",
				"fonts",
				"arial.ttf"
			);

			if (fs.existsSync(fontPath)) {
				GlobalFonts.registerFromPath(
					fontPath,
					"Arial"
				);
			}

		} catch {}

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

		// تحسين الجودة
		ctx.antialias = "subpixel";
		ctx.patternQuality = "best";
		ctx.quality = "best";
		ctx.textDrawingMode = "path";
		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = "high";

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
		font = "
