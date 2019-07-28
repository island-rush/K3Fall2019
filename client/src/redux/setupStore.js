import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { init, emit } from "./websocket";

const setupStore = () => {
	const initialState = {};

	const middleware = [thunk.withExtraArgument(emit)];

	const store = createStore(
		rootReducer,
		initialState,
		compose(
			applyMiddleware(...middleware),
			window.__REDUX_DEVTOOLS_EXTENSION__ &&
				window.__REDUX_DEVTOOLS_EXTENSION__()
		)
	);

	init(store);

	return store;
};

export default setupStore;
