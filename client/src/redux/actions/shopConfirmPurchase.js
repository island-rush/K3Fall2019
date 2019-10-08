const shopConfirmPurchase = () => {
	return (dispatch, getState, emit) => {
		const clientAction = {
			type: "shopConfirmPurchase",
			payload: {}
		};
		emit("clientSendingAction", clientAction);
	};
};

export default shopConfirmPurchase;
