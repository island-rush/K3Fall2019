import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { init, emit } from "./websocket";

export default () => {
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
