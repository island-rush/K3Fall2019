const shopPurchaseRequest = shopItemTypeId => {
	return (dispatch, getState, emit) => {
		const clientAction = {
			type: "shopPurchaseRequest",
			payload: {
				shopItemTypeId
			}
		};
		emit("clientSendingAction", clientAction);
	};
};

export default shopPurchaseRequest;
