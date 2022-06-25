import React, { Component } from 'react'
import Header from '../header'
import ProductList from '../product-list'
import Footer from '../footer'
import HomeSplash from '../home-splash'
import { setCard } from '../../redux/actions/cartActions/cardAction'
import { connect } from 'react-redux'
import DeleverService from '../../services/delever-service'
import AnchorLink from 'react-anchor-link-smooth-scroll'
import Scrollspy from 'react-scrollspy'

class Home extends Component {
  deleverService = new DeleverService()
  constructor(props) {
    super(props)
    this.state = {
      categories: [],
      index: 1,
      keys: [],
    }
  }

  componentDidMount() {
    this.deleverService
      .getAllCategories()
      .then((categories) => {
        this.setState(
          {
            categories: [...categories],
          },
          () => {
            let keys = []
            this.state.categories.map((item) => {
              let val = 'section-' + item.id
              keys.push(val)
            })
            this.setState({ keys })
          }
        )
      })
      .catch((error) => {
        console.log(error)
      })
  }

  changeCategory = (count) => {
    this.setState({ index: count })
  }

  handleCart = (item) => {
    const incItems = this.props.cartItems
    if (incItems.length === 0) {
      incItems.push(item)
      this.props.setCard({
        cartItem: item,
        cartItems: [item],
      })
    } else {
      this.checkCartItems(item, incItems)
    }
  }

  checkCartItems = (item, incItems) => {
    for (let key in incItems) {
      if (incItems[key].id === item.id) {
        this.props.setCard({
          cartItem: item,
          cartItems: incItems,
        })
        break
      }
      this.props.setCard({
        cartItem: item,
        cartItems: [...this.props.cartItems, item],
      })
    }
  }
  
  render() {
    const { categories, keys } = this.state
    return (
      <>
        <Header />
        <div className='category'>
          <div className='category_menu'>
            {keys && keys.length > 0 && (
              <Scrollspy
                offset={-100}
                className='category_list'
                items={[...keys]}
                currentClassName='active_link'
              >
                {categories.map((item) => (
                  <AnchorLink
                    key={item.id}
                    className='category_item'
                    offset={100}
                    href={`#section-${item.id}`}
                  >
                    {item.name.substring(2)}
                  </AnchorLink>
                ))}
              </Scrollspy>
            )}

            <ul offset={-100} className='category_list category_mob'>
              {categories.map((item) => (
                <li key={item.id} className='category_item'>
                  <AnchorLink
                    className='category_link'
                    offset={100}
                    href={`#section-${item.id}`}
                  >
                    {item.name.substring(2)}
                  </AnchorLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <HomeSplash />
        <ProductList
          count={categories.length}
          onAddedToCart={this.handleCart}
          changeCategory={this.changeCategory}
        />
        <Footer />
      </>
    )
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    setCard: (data) => {
      dispatch(setCard(data))
    },
  }
}

let mapStateToProps = (state) => {
  return {
    cartItems: state.card.cartItems,
    cartItem: state.card.cartItem,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
