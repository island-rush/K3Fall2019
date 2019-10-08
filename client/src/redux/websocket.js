import io from "socket.io-client";
import { SERVER_REDIRECT, SERVER_SENDING_ACTION } from "./socketEmits";

const socket = io(window.location.hostname);

export const init = store => {
	socket.on(SERVER_SENDING_ACTION, ({ type, payload }) => {
		store.dispatch({
			type,
			payload
		});
	});

	socket.on(SERVER_REDIRECT, serverError => {
		window.location.replace(`//${window.location.hostname}/index.html?error=${serverError}`);
	});
};

export const emit = (type, payload) => socket.emit(type, payload);
