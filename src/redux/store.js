import { combineReducers, createStore } from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import authReducer from "../redux/reducers/authReducer";
import cardReducer from "../redux/reducers/cardReducer";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user", "cart"],
};

const authPersistConfig = {
    key: "user",
    storage,
    whitelist: ["user"],
};

const cardPersistConfig = {
    key: "cart",
    storage,
    whitelist: ["cartItems"],
};

const rootReducer = combineReducers({
    profile: persistReducer(authPersistConfig, authReducer),
    card: persistReducer(cardPersistConfig, cardReducer)
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
    let store = createStore(persistedReducer, undefined, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
    let persistor = persistStore(store)
    window.store = store;
    return { store, persistor }
}



