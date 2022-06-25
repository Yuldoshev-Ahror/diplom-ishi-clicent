import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import DeleverService from '../services/delever-service'
import RegisterConfirm from './register-confirm'

export default class LoginModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      phone: '+998',
      confirm: false,
      isLoading: false,
      errorText: '',
      type: 'login-confirm',
    }
  }

  deleverService = new DeleverService();

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { name, phone } = this.state
    if (!phone || phone === '+998' || phone.length < 12) return
    this.setState({ isLoading: true })
    this.deleverService
      .login({ name, phone })
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
          if (body.Error.Code === 'NOT_FOUND') {
            this.props.goRegister(phone)
          }
        })
        this.setState({ isLoading: false })
      })
  }

  render() {
    const { phone, confirm, isLoading, errorText, type } = this.state
    return (
      <div className='login_modal-wrapper'>
        {!confirm ? (
          <div className='login_modal-holder'>
            <div className='auth_form'>
              <button onClick={this.props.closeModal} className='btn close_btn'>
                <AiOutlineClose />
              </button>
              <h4>Добро пожаловать</h4>
              <p>Войдите с вашим номером телефона</p>
              {errorText ? <p className='text-danger'>{errorText}</p> : ''}
              <form onSubmit={this.handleSubmit}>
                <input
                  type='tel'
                  name='phone'
                  id='phone'
                  value={phone}
                  placeholder='Номер телефона'
                  onChange={this.handleChange}
                  required
                />
                <div className='login_btn'>
                  {!isLoading ? (
                    <button className='btn text-white' type='submit'>
                      Войти
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
              </form>
              <div className='open_reg_modal'>
                <span className='mr-2'>У вас нет аккаунта?</span>
                <a
                  href='/'
                  className='text-danger'
                  onClick={this.props.register}
                >
                  Регистрация
                </a>
              </div>
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
