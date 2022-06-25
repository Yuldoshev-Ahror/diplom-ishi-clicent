import React from 'react'
import Header from '../header'
import ErrorIndicator from '../error-indicator'
import Footer from '../footer'
import AnchorLink from 'react-anchor-link-smooth-scroll'
import Scrollspy from 'react-scrollspy'

const Contacts = ({ location }) => {
    // console.log(location);
    // if (!location) return <ErrorIndicator />
    return (
        <>
            <Header />
            <section className="contacts-section" id="top">
                <div className="container-with-columns contacts">
                    <div className="left-column">
                        <div className="headline contacts_headline">
                            <h1 className="left-column__title contacts__title">Kontaklar</h1>
                        </div>
                        <div className="left-column__container contacts__section" id="general">
                            <div className="contacts__section-title">Telefonlar va aloqa markazlari</div>
                            <div className="contacts_section-description">24/7 murojat qilish mumkun</div>
                            <div className="contacts__row">
                                <div className="contacts__row-title">Toshkent</div>
                                <div className="contacts__row-info">
                                    <a href="tel:+998909000909" className="contacts__row-info-phone">+998(90) 900-09-09</a>
                                </div>
                            </div>
                            <div className="contacts__row">
                                <div className="contacts__row-title">Qashqadaryo</div>
                                <div className="contacts__row-info">
                                    <a href="tel:+998909000909" className="contacts__row-info-phone">+998(90) 900-09-09</a>
                                    {/* <a href="tel:+74956637722" className="contacts__row-info-phone">+7 (495) 663-77-22</a> */}
                                </div>
                            </div>
                            <div className="contacts__row">
                                <div className="contacts__row-title">Surxandaryo</div>
                                <div className="contacts__row-info">
                                    {/* <a href="tel:+74956637722" className="contacts__row-info-phone">+7 (495) 663-77-22</a> */}
                                    <a href="tel:+998909000909" className="contacts__row-info-phone">+998(90) 900-09-09</a>
                                </div>
                            </div>
                        </div>
                        <div className="left-column__container contacts__section" id="clients">
                            <div className="contacts__section-title">Mijozlarni qo'llab-quvvatlash</div>
                            <div className="contacts__row">
                                <div className="contacts__row-title">Elektron pochta</div>
                                <div className="contacts__row-info">
                                    <a href="mailto:info@ahrorfood.uz" className="contacts__row-info-email">info@ahrorfood.uz</a>
                                </div>
                            </div>
                            <div className="contacts__row">
                                <div className="contacts__row-title">Telefon raqami</div>
                                <div className="contacts__row-info">
                                    <a href="tel:+998935010770" className="contacts__row-info-email">+998 (90) 900-09-09</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right-column">
                        <nav className="sections-navigation">
                            <Scrollspy items={['general', 'clients', 'hr', 'partnership']} offset={-200} currentClassName="is-current">
                                <li className="sections-navigation__item">
                                    <AnchorLink offset="150" href="/general" className="sections-navigation__item-link">
                                        <span className="sections-navigation__item-link-title">Telefonlar va aloqa markazlari</span>
                                    </AnchorLink>
                                </li>
                                <li className="sections-navigation__item">
                                    <AnchorLink offset="150" href="/clients" className="sections-navigation__item-link">
                                        <span className="sections-navigation__item-link-title">Mijozlarni qo'llab-quvvatlash</span>
                                    </AnchorLink>
                                </li>
                               
                            </Scrollspy>
                        </nav>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

export default Contacts;