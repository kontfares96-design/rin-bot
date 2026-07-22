"use strict";

const EventEmitter = require("events");
const Logger = require("../../utils/logger");

class Listener extends EventEmitter {

	constructor(api) {

		super();

		this.api = api;

		this.listening = false;

		this.stopListening = null;

	}

	start() {

		if (this.listening)
			return;

		this.listening = true;

		Logger.system("بدء الاستماع للرسائل...");

		this.stopListening = this.api.listenMqtt((err, event) => {

			if (err) {

				Logger.error(err.message);

				this.emit("error", err);

				return;

			}

			if (!event)
				return;

			this.emit(event.type, event);

			switch (event.type) {

				case "message":
				case "message_reply":

					this.emit("message", event);

					break;

				case "message_reaction":

					this.emit("reaction", event);

					break;

				case "message_unsend":

					this.emit("unsend", event);

					break;

				case "event":

					this.emit("event", event);

					break;

				case "typ":

					this.emit("typing", event);

					break;

				case "presence":

					this.emit("presence", event);

					break;

				default:

					this.emit("unknown", event);

			}

		});

		Logger.success("Listener يعمل.");

	}

	stop() {

		if (!this.listening)
			return;

		this.listening = false;

		if (typeof this.stopListening === "function") {

			this.stopListening();

			this.stopListening = null;

		}

		Logger.warning("تم إيقاف Listener.");

	}

	restart() {

		this.stop();

		this.start();

	}

	isRunning() {

		return this.listening;

	}

}

module.exports = Listener;
