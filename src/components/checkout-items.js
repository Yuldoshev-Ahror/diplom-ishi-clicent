import React from 'react'
import { connect } from 'react-redux'
import { numberToPrice } from '../libs/numberToPrice'

function CheckoutItems({ cartItems, delivery_price }) {
  const [total, setTotal] = React.useState(0)
  React.useEffect(() => {
    calcTotalPrice()
  })
  const calcTotalPrice = () => {
    const priceList = cartItems.map((item) => item.totalPrice)
    if (priceList.length > 0) {
      const val = (priceList.reduce((a, b) => a + b) + delivery_price)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      setTotal(val)
    }
  }

  return (
    <aside className="cart_wrapper" id="checkout_items">
      <div className="sticky_outer-wrapper">
        <div className="sticky_inner-wrapper">
          <div className="order_info_check">
            <h3>Ваш заказ</h3>
            <div className="order_content-wrapper">
              <div className="order_content">
                <div className="items_wrapper">
                  {cartItems.map((cartItem) => (
                    <div key={cartItem.id} className="items">
                      <span className="quantity">{cartItem.count}</span>
                      <span className="multi">x</span>
                      <span className="item_info">{cartItem.name}</span>
                      <span className="price">
                        {numberToPrice(cartItem.price)}
                      </span>
                    </div>
                  ))}
                  <div className={`items`}>
                    <span className={'item_info'}>Доставка</span>
                    <span className="price">
                      {numberToPrice(delivery_price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="calculation_wrapper">
              <div className="text_wrapper total">
                <span>Итоговая сумма</span>
                <span>{numberToPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

let mapStateToProps = (state) => {
  return {
    cartItems: state.card.cartItems,
    cartItem: state.card.cartItem,
  }
}

export default connect(mapStateToProps, null)(CheckoutItems)
