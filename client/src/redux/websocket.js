import io from "socket.io-client";

const socket = io(window.location.hostname);

export const init = store => {
	socket.on("serverSendingAction", ({ type, payload }) => {
		store.dispatch({
			type,
			payload
		});
	});

	socket.on("serverRedirect", serverError => {
		window.location.replace(`//${window.location.hostname}/index.html?error=${serverError}`);
	});
};

export const emit = (type, payload) => socket.emit(type, payload);
