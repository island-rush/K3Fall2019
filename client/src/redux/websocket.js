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
};

export const emit = (type, payload) => socket.emit(type, payload);
