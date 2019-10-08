import setUserfeedbackAction from "./setUserfeedbackAction";

const confirmPlan = () => {
	return (dispatch, getState, emit) => {
		const { gameboardMeta } = getState();

		if (gameboardMeta.planning.moves.length === 0) {
			dispatch(setUserfeedbackAction("Can't submit an empty plan..."));
		} else {
			const clientAction = {
				type: "confirmPlan",
				payload: {
					pieceId: gameboardMeta.selectedPiece,
					plan: gameboardMeta.planning.moves
				}
			};

			emit("clientSendingAction", clientAction);
		}
	};
};

export default confirmPlan;
