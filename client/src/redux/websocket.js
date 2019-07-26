import io from "socket.io-client";

const socket = io(window.location.hostname);

export const init = store => {
	socket.on("serverSendingAction", serverAction => {
		const { type, payload } = serverAction;
		store.dispatch({
			type: type,
			payload: payload
		});
	});

	socket.on("serverRedirect", serverError => {
		window.location.replace(
			`//${window.location.hostname}/index.html?error=${serverError}`
		);
	});
};

export const emit = (type, payload) => socket.emit(type, payload);
