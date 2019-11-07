import { PIECE_CLICK } from "./actionTypes";

const selectPiece = selectedPiece => {
	return (dispatch, getState, emit) => {
		const { gameboardMeta } = getState();

		if (!gameboardMeta.planning.active) {
			dispatch({
				type: PIECE_CLICK,
				payload: {
					selectedPiece: selectedPiece
				}
			});
		}
	};
};

export default selectPiece;
