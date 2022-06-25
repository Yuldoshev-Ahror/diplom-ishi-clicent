import { authActionTypes } from "../actions/authActions/authActionTypes";

const initialState = {
    user: null,
};

const authReducer = (state = initialState, action) => {
    const { payload } = action;
    switch (action.type) {
        case authActionTypes.SET_USER:
            return {
                ...state,
                user: payload,
            };
        case authActionTypes.LOGOUT:
            return {
                ...state,
                user: null,
            };

        default:
            return state;
    }
};

export default authReducer;
