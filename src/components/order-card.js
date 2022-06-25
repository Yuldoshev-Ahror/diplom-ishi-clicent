import React, { Component } from 'react'

export default class OrderCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: props.date ?? '',
      order_number: props.order_number ?? '00023212',
      status: props.status ?? '',
      total: props.total ?? '',
      branch: props.branch,
    }
  }

  render() {
    const {
      date = '2020:09:24 18:23:44',
      total = '3 560 000',
      order_number = '00023212',
      status = 'в обработке',
      branch,
    } = this.state
    return (
      <div className={`card text-decoration-none text-dark border-0 my-2`}>
        <div className='card-header bg-white order_number'>
          <b>Заказ #{order_number}</b>
        </div>
        <div className='card-body bg-white rounded'>
          <div className='w-100 d-flex justify-content-between my-2'>
            <span>
              <b>Дата:</b>
            </span>
            <span>{date}</span>
          </div>
          <div className='w-100 d-flex justify-content-between my-2'>
            <span>
              <b>Статус:</b>
            </span>
            <span>{status}</span>
          </div>
          <div className='w-100 d-flex justify-content-between my-2'>
            <span>
              <b>Филиал:</b>
            </span>
            <span>{branch}</span>
          </div>
          <div className='w-100 d-flex justify-content-between my-2'>
            <span>
              <b>Доставка:</b>
            </span>
            <span>{this.props.delivery_price}</span>
          </div>
          <div className='w-100 d-flex justify-content-between my-2'>
            <span>
              <b>Всего:</b>
            </span>
            <span>
              {new Intl.NumberFormat().format(
                total + this.props.delivery_price
              )}
              сум
            </span>
          </div>
        </div>
      </div>
    )
  }
}
