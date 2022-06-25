import React, { Component } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import DeleverService from '../services/delever-service'
import RegisterConfirm from './register-confirm'

export default class RegisterModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      phone: this.props.tel ? this.props.tel : '+998',
      confirm: false,
      isLoading: false,
      errorText: '',
      type: 'register-confirm',
    }
  }

  deleverService = new DeleverService()

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { name, phone } = this.state
    this.setState({ isLoading: true })
    this.deleverService
      .register({ name, phone })
      .then((res) => {
        if (res.ok) {
          this.setState({ isLoading: false })
          this.setState({ confirm: true })
        } else {
          throw res
        }
      })
      .catch((error) => {
        error.json().then((body) => {
          this.setState({ errorText: body.Error.Message })
        })
        this.setState({ isLoading: false })
      })
  }

  render() {
    const { name, phone, confirm, isLoading, errorText, type } = this.state

    return (
      <div className='login_modal-wrapper'>
        {!confirm ? (
          <div className='login_modal-holder'>
            <div className='auth_form'>
              <button onClick={this.props.closeModal} className='btn close_btn'>
                <AiOutlineClose />
              </button>
              <h4>Регистрация</h4>
              {errorText ? <p className='text-danger'>{errorText}</p> : ''}
              <form onSubmit={this.handleSubmit}>
                <input
                  type='name'
                  name='name'
                  value={name}
                  placeholder='Имя'
                  onChange={this.handleChange}
                  required
                />
                <input
                  type='tel'
                  name='phone'
                  value={phone}
                  placeholder='Номер телефона'
                  onChange={this.handleChange}
                  required
                />

                <div className='login_btn'>
                  {!isLoading ? (
                    <button className='btn text-white' type='submit'>
                      Регистрация
                    </button>
                  ) : (
                    <button className='btn btn_spin' type='button' disabled>
                      <span
                        className='spinner-border spinner-border-sm'
                        role='status'
                        aria-hidden='true'
                      ></span>
                    </button>
                  )}
                </div>
                <div className='open_reg_modal'>
                  <span className='mr-2'>У вас есть аккаунта?</span>
                  <a
                    className='text-danger'
                    href='/'
                    onClick={this.props.login}
                  >
                    Войти
                  </a>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <RegisterConfirm
            phone={phone}
            closeModal={this.props.closeModal}
            type={type}
          />
        )}
      </div>
    )
  }
}
