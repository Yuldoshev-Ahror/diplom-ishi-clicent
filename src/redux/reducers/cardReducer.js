import { cardActionTypes } from "../actions/cartActions/cardActionTypes";

const initialState = {
    cartItem: null,
    cartItems: [],
};

const cardReducer = (state = initialState, action) => {
    const { payload } = action;

    switch (action.type) {

        case cardActionTypes.ADDTOCARD:
            const { cartItem, cartItems } = payload;
            return {
                ...state,
                cartItem,
                cartItems
            };
        case cardActionTypes.ACTIONFROMCARD:
            const { type, id } = payload;
            const items = actionFromCard(id, type, state.cartItems);
            return {
                ...state,
                cartItem: null,
                cartItems: [...items]
            };
        case cardActionTypes.CLEANCARD:
            return {
                ...state,
                cartItems: [],
            };

        default:
            return state;
    }
};

function actionFromCard(id, type, cartItems) {
    switch (type) {
        case "inc": {
            const incItems = cartItems;
            for (const key in incItems) {
                if (incItems[key].id === id) {
                    incItems[key].count += 1;
                    incItems[key].totalPrice = incItems[key].count * incItems[key].price;
                    break;
                }
            }
            return incItems;

        }
        case "dec": {
            const decItems = cartItems;
            for (const key in decItems) {
                if (decItems[key].id === id) {
                    if (decItems[key].count > 1) {
                        decItems[key].count -= 1;
                        decItems[key].totalPrice = decItems[key].count * decItems[key].price;
                    }
                    break;
                }
            }
            return decItems;

        }
        case "delete": {
            const deleteItems = cartItems.filter((item) => {
                return item.id !== id;
            });

            return deleteItems;

        }
        default:
            return cartItems;
    }
}


export default cardReducer;
