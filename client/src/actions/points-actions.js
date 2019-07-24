export const UPDATE_POINTS = 'points:updatePoints';

export function updateUser(newPoints) {
    return {
        type: UPDATE_POINTS,
        payload: {
            points: newPoints
        }
    }
}