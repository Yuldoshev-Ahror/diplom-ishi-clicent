import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { FaBars, FaShoppingCart, FaTimes } from 'react-icons/fa'
import logo from '../images/fastfood-logo.png'
import LoginModal from '../components/login-modal'
import RegisterModal from './register-modal'
import { connect } from 'react-redux'
import { logoutUser } from '../libs/localStorage'
import { logout } from '../redux/actions/authActions/authActions'
import { BsPerson } from 'react-icons/bs'
import CartPopup from './cart-popup'
import PhoneIcon from '@material-ui/icons/Phone'

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      isPopup: false,
      loginPopup: false,
      registerPopup: false,
      drop: false,
      phone: '',
      openCart: false,
      total: 0,
      categories: [],
      index: null,
      keys: [],
    }
  }

  closeDropdown = () => {
    this.setState({ drop: false })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.cartItem) {
      this.setState({ isPopup: true })
      setTimeout(
        function () {
          this.setState({ isPopup: false })
        }.bind(this),
        3000
      )
    }
  }

  handleOutsideClick = () => {
    this.setState({ drop: false })
  }

  componentDidMount() {
    const self = this
    document.addEventListener('click', function (e) {
      if (!e.target.closest('#dropdown')) {
        self.setState({ drop: false })
      }
    })
  }

  toggleNavbar = () => {
    this.setState({ isOpen: !this.state.isOpen }, () => {
      let ul = document.body
      if (this.state.isOpen) ul.style.overflow = 'hidden'
      else ul.style.overflow = 'auto'
    })
  }

  logout = (e) => {
    logoutUser()
    this.props.logout()
  }

  login = (e) => {
    e.preventDefault()
    this.setState({ loginPopup: true, registerPopup: false })
  }
  loginForCart = () => {
    this.setState({ loginPopup: true, registerPopup: false })
  }

  register = (e) => {
    e.preventDefault()
    this.setState({ loginPopup: false, registerPopup: true })
  }

  goRegister = (val) => {
    this.setState({ phone: val }, () => {
      this.setState({ loginPopup: false, registerPopup: true })
    })
  }

  closeModal = () => {
    this.setState({ loginPopup: false, registerPopup: false })
  }

  calcTotalPrice = () => {
    const priceList = this.props.cartItems.map((item) => item.totalPrice)
    if (priceList.length > 0) {
      const total = priceList
        .reduce((a, b) => a + b)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      this.setState({ total })
    }
  }

  openPopup = () => {
    this.calcTotalPrice()
    const vw = window.innerWidth
    this.setState({ openCart: true })
    if (vw < 900) document.body.classList.add('overflow')
  }

  closePopup = () => {
    const vw = window.innerWidth
    this.setState({ openCart: false })
    if (vw < 900) document.body.classList.remove('overflow')
  }
  resetStyle = () => {
    let ul = document.body
    ul.style.overflow = 'auto'
  }

  render() {
    const { isOpen, loginPopup, registerPopup, phone, openCart, total } =
      this.state
    const { cartItems, cartPage } = this.props

    return (
      <>
        <header className='main-header'>
          <nav className='navbar navbar-expand-lg'>
            <button
              className='navbar-toggler bg-white'
              onClick={this.toggleNavbar}
            >
              {isOpen ? (
                <FaTimes size='30px' color={'black'} />
              ) : (
                <FaBars color={'black'} />
              )}
            </button>
            <a href='/' className='navbar-brand'>
              <img src={logo} alt='Oq-Tepa Lavash' />
            </a>

            <div
              className={`navbar-collapse justify-content-md-end justify-content-sm-center p-0 ${
                isOpen ? '' : 'collapse'
              }`}
            >
              <ul
                className='navbar-nav w-100 px-3 bg-white'
                style={{ zIndex: 99 }}
              >
                <li className='nav-item '>
                  <Link
                    onClick={this.resetStyle}
                    to={{
                      pathname: '/',
                      state: cartItems,
                    }}
                    className='nav-link nav_btn'
                  >
                    Главная
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    onClick={this.resetStyle}
                    to={{
                      pathname: '/branches',
                      state: { cartItems: cartItems },
                    }}
                    className='nav-link nav_btn'
                  >
                    Филиалы
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    onClick={this.resetStyle}
                    to={{
                      pathname: '/about',
                      state: { cartItems: cartItems },
                    }}
                    className='nav-link nav_btn'
                  >
                    О нас
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    onClick={this.resetStyle}
                    to={{
                      pathname: '/contacts',
                      state: { cartItems: cartItems },
                    }}
                    className='nav-link nav_btn'
                  >
                    Контакты
                  </Link>
                </li>
                <ul
                  className='navbar_phone phone_nav bg-white'
                  style={{ zIndex: 99 }}
                >
                  <li className='nav_phone'>
                    <a
                      href='tel:+998909000909'
                      onClick={this.resetStyle}
                      className='nav-link nav_btn'
                    >
                      <span className='phone_icon'>
                        <PhoneIcon />
                      </span>
                      +998 (90) 900-09-09
                    </a>
                  </li>
                </ul>
              </ul>

              <ul
                className='navbar_phone bg-white desc_nav'
                style={{ zIndex: 99 }}
              >
                <li className='nav_phone'>
                  <a href='tel:+998909000909' className='nav-link nav_btn'>
                    <span className='phone_icon'>
                      <PhoneIcon />
                    </span>
                    +998 (90) 900-09-09
                  </a>
                </li>
              </ul>
            </div>

            {this.props.user ? (
              <div
                className='dropdown'
                id='dropdown'
                style={{ display: isOpen ? 'none' : 'block' }}
              >
                <button
                  className='btn btn-danger dropbtn btn_cabinet mr-md-3 mr-xl-3 mr-sm-1 mr-1 d-flex justify-content-center'
                  onClick={() => {
                    this.setState({ drop: !this.state.drop })
                  }}
                >
                  <span className='pr-2 profile_icon'>
                    <BsPerson />
                  </span>
                  <span className='profile_btn'>Личный кабинет</span>
                </button>
                <div
                  className='dropdown-content'
                  id='dropdown-content'
                  style={{ display: this.state.drop ? 'block' : 'none' }}
                >
                  <Link
                    id='#order'
                    to={{
                      pathname: '/order',
                      state: { cartItems: cartItems },
                    }}
                  >
                    Мои заказы
                  </Link>
                  <Link
                    id='#profile'
                    to={{
                      pathname: '/profile',
                      state: { cartItems: cartItems },
                    }}
                  >
                    Личный кабинет
                  </Link>
                  <Link
                    id='#address'
                    to={{
                      pathname: '/address',
                    }}
                  >
                    Мои адреса
                  </Link>
                  <a href='/' id='#logout' onClick={this.logout}>
                    Выйти
                  </a>
                </div>
              </div>
            ) : (
              <div
                className='btn_sig  btn_cabinet'
                style={{ display: isOpen ? 'none' : 'block' }}
              >
                <a
                  href='/'
                  className='nav-link btn signin_btn'
                  onClick={this.login}
                >
                  Войти
                </a>
              </div>
            )}
            {cartItems.length > 0 ? (
              <div className={`cart-button ${cartPage ? 'mobile-hidden' : ''}`}>
                <a
                  href='/'
                  onClick={(e) => {
                    e.preventDefault()
                    this.openPopup()
                  }}
                  className='cart-button_link'
                >
                  <div className='cart-button-inner'>
                    <FaShoppingCart />
                    <div className='cart-button_title'>Корзина</div>
                    <div className='cart-button_quantity'>
                      {cartItems.length}
                    </div>
                  </div>
                </a>
              </div>
            ) : (
              ''
            )}
          </nav>
        </header>
        <CartPopup
          openPopup={this.openPopup}
          calcTotalPrice={this.calcTotalPrice}
          total={total}
          loginForCart={this.loginForCart}
          openCart={openCart}
          closePopup={this.closePopup}
        />
        {loginPopup ? (
          <LoginModal
            closeModal={this.closeModal}
            goRegister={this.goRegister}
            register={this.register}
          />
        ) : (
          ''
        )}
        {registerPopup ? (
          <RegisterModal
            tel={phone}
            closeModal={this.closeModal}
            login={this.login}
          />
        ) : (
          ''
        )}
      </>
    )
  }
}

let mapStateToProps = (state) => {
  return {
    user: state.profile.user,
    cartItems: state.card.cartItems,
    cartItem: state.card.cartItem,
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      dispatch(logout())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
