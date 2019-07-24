import { UPDATE_POINTS } from '../actions/points-actions';

export default function pointsReducer(state = -1, { type, payload }) {
    switch (type) {
        case UPDATE_POINTS:
            return payload.points;
        default:
            return state;
    }
}