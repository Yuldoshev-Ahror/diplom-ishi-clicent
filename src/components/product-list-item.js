import React, { Component } from "react";
import { FaTimes, FaPlus, FaMinus } from "react-icons/fa";

export default class ProductListItem extends Component {
  constructor(props) {
    super(props);
    const { meal } = this.props;
    meal.count = 1;
    meal.totalPrice = meal.count * meal.price;
    this.state = {
      isPopup: false,
      meal,
    };
  }

  handleCart = (value) => {
    this.setState({
      isPopup: false,
    });
    const body = document.body;
    body.classList.remove("popup_overflow");
    this.props.onAddedToCart(value);
  };

  showPopup = () => {
    const { isPopup } = this.state;

    this.setState({ isPopup: !isPopup }, function () {
      if (isPopup) {
        const body = document.body;
        body.classList.remove("popup_overflow");
      } else {
        const body = document.body;
        body.classList.add("popup_overflow");
      }
    });
  };

  onIncrease = () => {
    const item = this.state.meal;
    item.count += 1;
    item.totalPrice = item.count * item.price;
    this.setState({
      meal: item,
    });
  };
  onDecrease = () => {
    const item = this.state.meal;
    if (item.count > 1) {
      item.count -= 1;
      item.totalPrice = item.count * item.price;
      this.setState({
        meal: item,
      });
    }
  };
  render() {
    const { meal, isPopup } = this.state;
    return (
      <div key={meal._id} className="col-12 col-md-6 col-lg-3">
        <div className="card">
          <img src={meal.image} alt={meal.name} className="product_list-img" />
          <div className="card-body">
            <div className="info-block-container">
              <div className="info-block">
                <h5 className="card-title">{meal.name}</h5>
                <p className="card-text">{`${meal.description.substr(0, 50)}...`}</p>
              </div>
              <div className="info-block hover">
                <h5 className="card-title">{meal.name}</h5>
                <p className="card-text">{meal.description}</p>
              </div>
            </div>
            <div className="card-footer">
              <div className="money">
                <span className="money_value">
                  {meal.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                </span>
                <span className="money_currency">сум</span>
              </div>
              <button className="btn product_btn" onClick={this.showPopup}>
                Выбрать
              </button>
            </div>
          </div>
        </div>
        {isPopup ? (
          <div className="product_list-popup">
            <div className="popup_container">
              <div className="popup_overlay" />
              <div className={`popup_content ${isPopup ? "show" : ""}`}>
                <div className="popup_dialog d-flex align-items-center">
                  <div className="popup_dialog-inner row">
                    <button
                      className="popup_dialog-close laptop_btn"
                      onClick={this.showPopup}
                    >
                      <FaTimes size="30px" fill="#fff" />
                    </button>
                    <div className="popup_dialog-right col-md-6">
                      <div className="popup_image">
                        <img
                          src={meal.image}
                          alt={meal.name}
                          className="img-fluid"
                        />
                      </div>
                    </div>
                    <div className="popup_dialog-left col-md-6">
                      <div>
                        <button
                          className="popup_dialog-close mobile_btn"
                          onClick={this.showPopup}
                        >
                          <FaTimes size="30px" fill="#fff" />
                        </button>
                        <h5 className="card-title">{meal.name}</h5>
                        <img
                          src={meal.image}
                          alt={meal.name}
                          className="img-fluid"
                        />
                        <p className="card-text">{meal.description}</p>
                      </div>
                      <div className="card-footer">
                        <div className="quantity_list">
                          <div className="money-title">Количество</div>
                          <div className="cart_line-control">
                            <div className="wrapper">
                              <div className="cart_line-wrapper">
                                <button
                                  className="btn btn-outline-primary"
                                  onClick={this.onDecrease}
                                >
                                  <FaMinus />
                                </button>
                                <div className="cart_line-quantity">
                                  {meal.count}
                                </div>
                                <button
                                  className="btn btn-outline-primary"
                                  onClick={this.onIncrease}
                                >
                                  <FaPlus />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="price_list">
                          <div className="money-title">Стоимость</div>
                          <div className="money">
                            <span className="money_value">
                              {meal.totalPrice
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                            </span>
                            <span className="money_currency">сум</span>
                          </div>
                        </div>
                        <div className="product_button">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => this.handleCart(meal)}
                          >
                            В корзину
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
