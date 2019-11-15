import io from "socket.io-client";
import { SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION } from "../gameData/otherConstants";

const socket = io(window.location.hostname);

export const init = store => {
    socket.on(SOCKET_SERVER_SENDING_ACTION, ({ type, payload }) => {
        store.dispatch({
            type,
            payload
        });
    });

    socket.on(SOCKET_SERVER_REDIRECT, serverError => {
        window.location.replace(`//${window.location.hostname}/index.html?error=${serverError}`);
    });
};

export const emit = (type, payload) => socket.emit(type, payload); //TODO: refactor the emit (client-side), since we always know this is SOCKET_CLIENT_SENDING_ACTION
