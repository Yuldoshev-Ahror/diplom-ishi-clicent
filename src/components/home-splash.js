import React, { useEffect, useState } from 'react'
import { Carousel } from 'react-bootstrap'
import DeleverService from '../services/delever-service'

const HomeSplash = () => {
  const [banners, setBanners] = useState(null)
  useEffect(() => {
    new DeleverService()
      .getBanners()
      .then((res) => {
        setBanners(res.banners)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <section className='home_splash' id='top'>
      <Carousel>
        {banners &&
          banners.map((item) => (
            <Carousel.Item key={item.id}>
              <img src={item.image} alt='fastood' />
            </Carousel.Item>
          ))}
      </Carousel>
    </section>
  )
}

export default HomeSplash
