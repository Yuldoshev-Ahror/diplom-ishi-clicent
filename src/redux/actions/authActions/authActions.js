import { authActionTypes } from "./authActionTypes";

export const setUser = (user) => {
    return {
        type: authActionTypes.SET_USER,
        payload: user,
    };
};


export const logout = () => ({
    type: authActionTypes.LOGOUT,
});



// export const openModal = () => ({
//     type: authActionTypes.OPEN_MODAL,
// });
// export const closeModal = () => ({
//     type: authActionTypes.CLOSE_MODAL,
// });
