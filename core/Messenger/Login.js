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
			"rinstate.json"
		);

	}

	loadState() {

		if (!fs.existsSync(this.statePath)) {

			throw new Error(
				"لم يتم العثور على rinstate.json"
			);

		}

		return JSON.parse(
			fs.readFileSync(this.statePath, "utf8")
		);

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

}	async connect() {

		Logger.system("جاري تسجيل الدخول إلى Facebook...");

		const appState = this.loadState();

		return new Promise((resolve, reject) => {

			login(
				{
					appState,
					listenEvents: true,
					forceLogin: true,
					selfListen: false,
					autoMarkRead: false,
					autoMarkDelivery: false,
					updatePresence: false
				},
				(err, api) => {

					if (err) {

						Logger.error(err.message);

						return reject(err);

					}

					this.api = api;

					this.connected = true;

					try {

						const newState = api.getAppState();

						this.saveState(newState);

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
		catch {}

		this.api = null;

		this.connected = false;

		Logger.warning("تم تسجيل الخروج.");

	}

	async reconnect() {

		await this.disconnect();

		return this.connect();

	}

}
module.exports = Login;
