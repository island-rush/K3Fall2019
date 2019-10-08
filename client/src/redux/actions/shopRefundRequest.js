const shopRefundRequest = shopItem => {
	return (dispatch, getState, emit) => {
		const clientAction = {
			type: "shopRefundRequest",
			payload: {
				shopItem
			}
		};
		emit("clientSendingAction", clientAction);
	};
};

export default shopRefundRequest;
