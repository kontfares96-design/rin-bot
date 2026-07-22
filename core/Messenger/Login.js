"use strict";

const fs = require("fs");
const path = require("path");
const login = require("fca-unofficial");

const Logger = require("../../utils/logger");

class Login {

	constructor(config) {

		this.config = config;

		this.api = null;

		this.connected = false;

		this.statePath = path.join(
			process.cwd(),
			"config",
			"fbstate.json"
		);

	}

	loadState() {

		if (!fs.existsSync(this.statePath)) {
			throw new Error("لم يتم العثور على fbstate.json");
		}

		try {

			return JSON.parse(
				fs.readFileSync(this.statePath, "utf8")
			);

		}
		catch {

			throw new Error("fbstate.json غير صالح.");

		}

	}

	saveState(appState) {

		fs.writeFileSync(
			this.statePath,
			JSON.stringify(appState, null, 2)
		);

	}

	getAPI() {

		return this.api;

	}

	isConnected() {

		return this.connected;

	}

	async connect() {

		Logger.system("جاري تسجيل الدخول إلى Facebook...");

		const appState = this.loadState();

		return new Promise((resolve, reject) => {

			login(
				{
					appState
				},
				(err, api) => {

					if (err) {

						Logger.error(err.message);

						return reject(err);

					}

					api.setOptions({

						listenEvents: true,
						forceLogin: true,
						selfListen: false,
						autoMarkRead: false,
						autoMarkDelivery: false,
						updatePresence: false,
						online: true

					});

					this.api = api;

					this.connected = true;

					try {

						this.saveState(
							api.getAppState()
						);

					}
					catch {}

					Logger.success("تم تسجيل الدخول بنجاح.");

					resolve(api);

				}
			);

		});

	}

	async disconnect() {

		if (!this.api)
			return;

		try {

			if (typeof this.api.logout === "function")
				await this.api.logout();

		}
		catch (err) {

			Logger.error(err.message);

		}

		this.api = null;

		this.connected = false;

		Logger.warning("تم تسجيل الخروج.");

	}

	async reconnect() {

		await this.disconnect();

		return await this.connect();

	}

}

module.exports = Login;
