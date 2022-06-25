import React from 'react'
import logo from '../images/fastfood-logo.png'
// import google_play from '../images/google_play.svg'
import { FaTelegramPlane, FaFacebookF, FaInstagram } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import AnchorLink from 'react-anchor-link-smooth-scroll'
import { connect } from 'react-redux'

const Footer = ({ cartItems }) => {
  return (
    <footer>
      <div className='footer_navigation'>
        <div className='container'>
          <div className='scroll-top'>
            <AnchorLink offset='150' href='/top' className='scroll-top_btn'>
              ↑&nbsp;Yuqoriga
            </AnchorLink>
          </div>
        </div>
      </div>
      <div className='footer-links'>
        <div className='container'>
          <div className='row'>
            <div className='col-12 col-lg-4'>
              <a href='/' className='footer-links_logo'>
                <img src={logo} alt='OqTepa Lavash' />
              </a>
              <ul className='footer-links_menu'>
                <li className='item'>
                  <Link
                    to={{
                      pathname: '/branches',
                      state: { cartItems: cartItems },
                    }}
                    className='item-links'
                  >
                    Filiallar
                  </Link>
                </li>
                <li className='item'>
                  <Link
                    to={{
                      pathname: '/about',
                      state: { cartItems: cartItems },
                    }}
                    className='item-links'
                  >
                    Biz haqimizda
                  </Link>
                </li>
                <li className='item'>
                  <Link
                    to={{
                      pathname: '/contacts',
                      state: { cartItems: cartItems },
                    }}
                    className='item-links'
                  >
                    Kontaktlar
                  </Link>
                </li>
              </ul>
            </div>
            <div className='col-12 col-lg-4'>
              <div className='footer-links_social'>
                <p>bizga qo'shiling</p>
                <ul className='social-list'>
                  <li className='item'>
                    <a
                      href='https://www.facebook.com'
                      target='_blank'
                      rel='noreferrer noopener'
                      className='social-link'
                    >
                      <FaFacebookF />
                    </a>
                  </li>
                  <li className='item'>
                    <a
                      href='https://www.instagram.com'
                      target='_blank'
                      rel='noreferrer noopener'
                      className='social-link'
                    >
                      <FaInstagram />
                    </a>
                  </li>
                  <li className='item'>
                    <a
                      href='https://t.me/Yuldoshev_akhror'
                      target='_blank'
                      rel='noreferrer noopener'
                      className='social-link'
                    >
                      <FaTelegramPlane />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className='col-12 col-lg-4'>
              <div className='footer-links_applications'>
                <p className='mb-2'>Raqam bo'yicha buyurtma</p>
                <a href='tel:+998993340187'>+998 99 334 01 87</a>
                {/* <ul className='application-list'>
                  <li className='item'>
                    <a
                      href='https://cdn.delever.uz/delever/Oqtepa%20Lavash%20Ar.apk'
                      download
                      target='_blank'
                      rel='noreferrer noopener'
                      className='application-link'
                    >
                      <img src={google_play} alt='download from google play' />
                    </a>
                  </li>
                  <li className='item'>
                    <a
                      href='/'
                      target='_blank'
                      rel='noreferrer noopener'
                      className='application-link'
                    >
                      <img src={app_store} alt='download from app store' />
                    </a>
                  </li>
                </ul> */}
              </div>
            </div>
          </div>
          <div className='footer-copyright'>
            <div className='footer-copyright_section'>
              © 2017–2020, ООО «Oq-Tepa Lavash», официальный сайт
            </div>
            <div className='footer-copyright_section'>
              <a href='/agreement' className='link'>
                Пользовательское соглашение
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

let mapStateToProps = (state) => {
  return {
    cartItems: state.card.cartItems,
    cartItem: state.card.cartItem,
  }
}

export default connect(mapStateToProps, null)(Footer)
