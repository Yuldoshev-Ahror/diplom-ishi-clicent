import React from 'react'
import Header from '../header'
import ErrorIndicator from '../error-indicator'
import Footer from '../footer'
import FeaturesSection from '../features-section'
// import about from '../../images/about.jpg'

const About = ({ location }) => {
  // if (!location) return <ErrorIndicator />
  return (
    <>
      <Header />
      <section className='about_splash' id='top'>
        <img style={{maxHeight: 350}} src="https://static01.nyt.com/images/2022/03/07/multimedia/05ukraine-blog-food-print/05ukraine-blog-food-topart-videoSixteenByNineJumbo1600.jpg" alt='Fast Food' />
      </section>
      <FeaturesSection />
      <Footer />
    </>
  )
}

export default About
