import React, { useState } from 'react'
import Header from '../header'
import ErrorIndicator from '../error-indicator'
import Footer from '../footer'
import CheckoutForm from '../checkout-form'
import CheckoutItems from '../checkout-items'
import { Link } from 'react-router-dom'
// import order from '../../images/order.svg'

const Cart = ({ location }) => {
  const [create, isCreate] = React.useState(false)
  const [orderNum, setOrderNum] = React.useState(false)

  const onCreate = () => {
    isCreate(true)
  }
  const setNum = (id) => {
    setOrderNum(id)
  }
  const [delivery_price, setDeliveryPrice] = useState(9000)

  // if (!location) return <ErrorIndicator />
  return (
    <>
      <>
        <Header />
        {create ? (
          <div className='order_accepted d-flex align-items-center justify-content-center'>
            <div className='order-block'>
              <div className='jumbotron'>
                <h1>Успешно !</h1>
              </div>

              <div className='order-confirm__img'>
                <img src="https://thumbs.dreamstime.com/b/shopping-cart-check-mark-icon-vector-filled-flat-sign-purchase-confirmation-bicolor-pictogram-green-blue-colors-symbol-logo-193281692.jpg"></img>
              </div>
              <p className='order_ac--text'>Номер заказа: #{orderNum}</p>
              <div className='order__created__text'>
                <p>Ваша заказ успешно был создан.</p>
                <p>Скоро наши операторы свяжутся с вами</p>
                <p>Спасибо за выбор</p>
              </div>

              <div className='cart_actions'>
                <Link to='/' className='btn btn-primary home_btn'>
                  Вернуться в меню
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className='checkout_wrapper' id='top'>
            <div className='checkout_container'>
              <CheckoutForm
                onCreate={onCreate}
                setDeliveryPrice={setDeliveryPrice}
                delivery_price={delivery_price}
                setNum={setNum}
              />
              <CheckoutItems delivery_price={delivery_price} />
            </div>
          </div>
        )}
        <Footer />
      </>
    </>
  )
}

export default Cart
