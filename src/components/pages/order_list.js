import React, { useState, useEffect } from 'react'
import Header from '../header'
import ErrorIndicator from '../error-indicator'
import Footer from '../footer'
import DeleverService from '../../services/delever-service'
import { numberToPrice } from '../../libs/numberToPrice'

const OrderList = ({ location }) => {
  const [order, setOrder] = useState(null)
  const { orderId, total, delivery_price, order_number } = location.state
  useEffect(() => {
    const access_token = localStorage.getItem('access_token');
    // const mockProductData = [
    //   {
    //     name: "Pizza",
    //     price: 250000,
    //     quantity: 2,
    //     total_amount: 450000
  
    //   },
    //   {
    //     name: "Pizza",
    //     price: 250000,
    //     quantity: 2,
    //     total_amount: 450000
  
    //   },
    //   {
    //     name: "Pizza",
    //     price: "250000",
    //     quantity: 2,
    //     total_amount: 450000
  
    //   }
    // ]
    // setOrder([...mockProductData]);
    if (orderId) {
      const deleverService = new DeleverService()
      deleverService
        .getOrderById(access_token, `${orderId}`)
        .then((res) => {
          if (res.ok) {
            return res.json()
          } else {
            throw res
          }
        })
        .then((data) => {
          setOrder(data.order.children)
        })
    }
  }, [])

  if (!location) return <ErrorIndicator />

  return (
    <>
      <Header />
      <div className="container my-2 order_info" id="top">
        <div className="row my-3">
          <div className="col-md-12 order_list pt-4">
            <h2>Информация о заказе №{order_number} </h2>
            <table className="table text-center">
              <thead>
                <tr>
                  <th scope="col">№</th>
                  <th scope="col">Имя</th>
                  <th scope="col">Цена</th>
                  <th scope="col">Количество</th>
                  <th scope="col">Общая сумма</th>
                </tr>
              </thead>
              <tbody>
                {order
                  ? order.map((product, i) => (
                      <tr key={i}>
                        <td data-label="№">{i + 1}</td>
                        <td data-label="Имя">{product.name}</td>
                        <td data-label="Цена">
                          {numberToPrice(product.price)}
                        </td>
                        <td data-label="Количество">{product.quantity}</td>
                        <td data-label="Общая сумма">
                          {numberToPrice(product.total_amount)}
                        </td>
                      </tr>
                    )
                  )
                  : ''}
                <tr className="total_info">
                  <td className="mob_td">
                    <b>Доставка</b>
                  </td>
                  <td className="mob_td"></td>
                  <td className="mob_td"></td>
                  <td className="mob_td"></td>
                  <td data-label="Доставка ">
                    <b>{numberToPrice(delivery_price)}</b>
                    {/* <b>{numberToPrice(delivery_price)}</b> */}
                  </td>
                </tr>
                <tr className="total_info">
                  <td className="mob_td">
                    <b>Общая сумма</b>{' '}
                  </td>
                  <td className="mob_td"></td>
                  <td className="mob_td"></td>
                  <td className="mob_td"></td>
                  <td data-label="Общая сумма">
                    <b>{numberToPrice(total)}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default OrderList
