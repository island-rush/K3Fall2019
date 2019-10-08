import { CLEAR_BATTLE } from "./actionTypes";

const clearOldBattle = () => {
	return (dispatch, getState, emit) => {
		const { gameboardMeta } = getState();
		const { battle } = gameboardMeta;

		dispatch({
			type: CLEAR_BATTLE,
			payload: {
				battle
			}
		});
	};
};

export default clearOldBattle;
