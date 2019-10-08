const mainButtonClick = () => {
	return (dispatch, getState, emit) => {
		//check the local state before sending to the server
		const clientAction = {
			type: "mainButtonClick",
			payload: {}
		};
		emit("clientSendingAction", clientAction);
	};
};

export default mainButtonClick;
