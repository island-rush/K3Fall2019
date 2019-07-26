export function clientSendingDataAction(clientData) {
	return (dispatch, getState, emit) => {
		emit("clientSendingData", clientData);
	};
}
