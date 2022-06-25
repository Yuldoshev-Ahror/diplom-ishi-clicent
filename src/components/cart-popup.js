import React, { useEffect, useRef } from "react";
import { FaTimes, FaMinus, FaShoppingCart, FaPlus,  FaTrash } from "react-icons/fa";
import { numberToPrice } from "../libs/numberToPrice";
import { setCard, actionFromCard } from "../redux/actions/cartActions/cardAction";
import { connect } from "react-redux";
import { LazyImage } from "./lazy-image";
import { useHistory } from 'react-router-dom';
import CartIcon from "./cart-icon";


function CartPopup({ cartItems, actionFromCard, openCart, user, openPopup, loginForCart, closePopup, total, calcTotalPrice }) {
    

    const history = useHistory();

    useEffect(() => {
        calcTotalPrice();
    })

    const handleIncItem = (id) => {
        actionFromCard({ id, type: "inc" })
        calcTotalPrice();
    }
    const handleDecItem = (id) => {
        actionFromCard({ id, type: "dec" })
        calcTotalPrice();
    }
    const handleDeleteItem = (id) => {
        actionFromCard({ id, type: "delete" })
        calcTotalPrice();
    }

    const checkUser = () => {
        if (!user) {
            loginForCart();
            closePopup();
            return
        } else {
            closePopup();
            history.push("/checkout");
        }
    }

    const wrapperRef = useRef(null);
    useOutsideCloseMenu(wrapperRef);

    function useOutsideCloseMenu(ref) {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    closePopup();
                }
            }
            document.addEventListener("mousedown", handleClickOutside);

            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };

        }, [ref]);
    }


    return (
        <>
            <div className={`cart_popup ${openCart ? "show" : ""}`} ref={wrapperRef}>
                <div className="cart_popup-body">
                    <div className="cart_popup-header">
                        <div className="item_count">
                            <span>
                                Корзина
                            </span>
                        </div>
                        <button
                            className="btn close_button"
                            onClick={() => closePopup()}
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="cart_popup-items">
                        <div className="cart_items-wrapper">
                            <div className="items_wrapper">
                                {cartItems.length > 0 ? (
                                    cartItems.map((cartItem) => {
                                        return (
                                            <div
                                                key={cartItem._id}
                                                className="item_box"
                                            >
                                                <div className="counter_mob">
                                                    <button
                                                        onClick={() =>
                                                            handleDecItem(cartItem._id)
                                                        }
                                                        className="btn counter_btn"
                                                    >
                                                        <FaMinus />
                                                    </button>
                                                    <span className="counter_value">
                                                        <span>
                                                            {cartItem.count}
                                                        </span>
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleIncItem(cartItem._id)
                                                        }
                                                        className="btn counter_btn"
                                                    >
                                                        <FaPlus />
                                                    </button>
                                                </div>

                                                <LazyImage
                                                    src={cartItem.image}
                                                    alt={cartItem.name}
                                                />
                                                <div className="cart_info_cart">
                                                    <span className="item_name">
                                                        {cartItem.name}
                                                    </span>
                                                    <span className="item_price">
                                                        {numberToPrice(
                                                            cartItem.price
                                                        )}
                                                    </span>

                                                    <span className="item_total mobile">
                                                        <span>Сумма: </span>
                                                        {numberToPrice(
                                                            cartItem.totalPrice
                                                        )}
                                                    </span>
                                                </div>
                                                <span className="item_total">
                                                    <div className="counter_box">
                                                        <button
                                                            onClick={() =>
                                                                handleDecItem(cartItem._id)
                                                            }
                                                            className="btn counter_btn"
                                                        >
                                                            <FaMinus />
                                                        </button>
                                                        <span className="counter_value">
                                                            <span>
                                                                {cartItem.count}
                                                            </span>
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                handleIncItem(cartItem._id)
                                                            }
                                                            className="btn counter_btn"
                                                        >
                                                            <FaPlus />
                                                        </button>
                                                    </div>
                                                    {numberToPrice(
                                                        cartItem.totalPrice
                                                    )}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteItem(cartItem._id)
                                                    }
                                                    className="btn remove_btn"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        );
                                    })
                                ) : (
                                        <>
                                            <div className="no_product-img">
                                                <CartIcon />
                                            </div>
                                            <span className="no_product-msg pt-0">Корзина пуста</span>
                                        </>
                                    )}
                            </div>
                        </div>
                        <button
                            className="btn clear_btn"
                        >
                            Очистить корзину
                        </button>
                        <div className="bottom_box">
                            <div className="inner_box" />
                        </div>
                        <div className="right_box">
                            <div className="inner_box" />
                        </div>
                    </div>

                    {cartItems.length ?
                        <div className="checkout_button-wrapper">
                            <button className="btn checkout_button" onClick={() => checkUser()}>

                                <span className="btn_text">Заказать</span>
                                <span className="price_box">
                                    {numberToPrice(total)}
                                </span>

                            </button>
                        </div> : ''}
                </div>
            </div>
            <button id="cartButton" className="btn cart_button" onClick={() => openPopup()}>
                <span className="total_items">
                    <span>
                        <FaShoppingCart />
                    </span>
                    <span>{cartItems.length} шт</span>
                </span>
                <span className="price">{cartItems.length > 0 ? numberToPrice(total) : "0 сум"}</span>
            </button>

        </>
    )
}

let mapDispatchToProps = (dispatch) => {
    return {
        setCard: (data) => {
            dispatch(setCard(data));
        },

        actionFromCard: (data) => {
            dispatch(actionFromCard(data));
        }
    }
}


let mapStateToProps = (state) => {
    return {
        cartItems: state.card.cartItems,
        cartItem: state.card.cartItem,
        user: state.profile.user,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartPopup);
