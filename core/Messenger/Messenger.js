"use strict";

const Login = require("./Login");
const Logger = require("../../utils/logger");

class Messenger {

	constructor(config) {

		this.config = config;

		this.login = new Login(config);

		this.api = null;

		this.started = false;

		this.startedAt = null;

	}

	async start() {

		if (this.started)
			return this.api;

		Logger.system("بدء تشغيل Messenger...");

		this.api = await this.login.connect();

		this.started = true;

		this.startedAt = Date.now();

		Logger.success("Messenger جاهز.");

		return this.api;

	}

	async stop() {

		if (!this.started)
			return;

		await this.login.disconnect();

		this.api = null;

		this.started = false;

		this.startedAt = null;

		Logger.warning("تم إيقاف Messenger.");

	}

	async restart() {

		await this.stop();

		return this.start();

	}

	getAPI() {

		return this.api;

	}

	isStarted() {

		return this.started;

	}

	getUptime() {

		if (!this.startedAt)
			return 0;

		return Date.now() - this.startedAt;

	}

}

module.exports = Messenger;
