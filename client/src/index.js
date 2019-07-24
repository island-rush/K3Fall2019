import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';

import pointsReducer from './reducers/points-reducer';

const allReducers = combineReducers({
    points: pointsReducer
});

const store = createStore(
    allReducers,
    {
        //initial state?
    },
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
