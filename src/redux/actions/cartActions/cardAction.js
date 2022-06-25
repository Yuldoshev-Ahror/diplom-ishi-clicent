import { cardActionTypes } from "./cardActionTypes";


export const setCard = (data) => {
    return {
        type: cardActionTypes.ADDTOCARD,
        payload: data,
    };
};

export const actionFromCard = (data) => {
    return {
        type: cardActionTypes.ACTIONFROMCARD,
        payload: data,
    };
};


export const clean = () => ({
    type: cardActionTypes.CLEANCARD,
});



// export const openModal = () => ({
//     type: authActionTypes.OPEN_MODAL,
// });
// export const closeModal = () => ({
//     type: authActionTypes.CLOSE_MODAL,
// });
