import React, { Component } from "react";
import DeleverService from "../services/delever-service";
import ProductListItem from "./product-list-item";
import ErrorIndicator from "./error-indicator";
import Skeleton from "@material-ui/lab/Skeleton";
import { times } from "lodash";
import Box from "@material-ui/core/Box";
import { Spinner } from "react-bootstrap";

export default class ProductList extends Component {
  deleverService = new DeleverService();
  state = {
    meals: [],
    categories: [],
    hasError: false,
    loading: true,
    page: 1,
    load: false,
    checked: "",
  };
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.getCategory();
  }

  getCategory = () => {
    this.deleverService
      .getCategory(this.state.page)
      .then((data) => {
        const cat = data[0];
        const { categories } = this.state;
        this.setState(
          {
            categories: [...categories, ...data],
            load: false,
          },
          () => {
            this.props.changeCategory(cat);
            this.deleverService
              .getAllMeals(cat?.id)
              .then((item) => {
                const { meals } = this.state;
                if (item) {
                  this.setState({
                    meals: [...item, ...meals],
                  });
                }
              })
              .catch((error) => {
                this.setState({
                  hasError: true,
                });
              });
            if (cat?.child_categories && cat.child_categories.length > 0) {
              cat.child_categories.map((item) => {
                return this.deleverService
                  .getAllMeals(item.id)
                  .then((items) => {
                    const { meals } = this.state;
                    if (items) {
                      this.setState({
                        meals: [...items, ...meals],
                        load: false,
                      });
                    }
                  })
                  .catch((error) => {
                    this.setState({
                      hasError: true,
                      loading: false,
                    });
                  });
              });
            } else {
              this.setState({
                load: false,
              });
            }
          }
        );
      })
      .catch((error) => {
        this.setState({
          hasError: true,
          loading: false,
        });
      });
  };

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const lastProductLoaded = document.querySelector(
      ".products_row > .products_col:last-child"
    );
    if (lastProductLoaded) {
      const lastProductLoadedOffset =
        lastProductLoaded.offsetTop + lastProductLoaded.clientHeight;
      const pageOffset = window.pageYOffset + window.innerHeight;

      if (pageOffset > lastProductLoadedOffset) {
        const { categories } = this.state;
        if (this.props.count > categories.length) {
          const { page, load } = this.state;
          if (!load) {
            this.setState({ page: page + 1 }, () => {
              this.setState({ load: true }, () => {
                this.getCategory();
              });
            });
          }
        }
      }
    }
  };

  handleCart = (value) => {
    this.props.onAddedToCart(value);
  };

  render() {
    const { meals, categories, hasError, load } = this.state;
    if (hasError) return <ErrorIndicator />;

    return (
      <div className="product_list py-lg-5">
        <div className="container products_row">
          {categories.length > 0 && meals.length > 0
            ? categories &&
              categories.map((category, i) => (
                <>
                  <React.Fragment>
                    <section
                      key={category.id}
                      className="product_item  products_col"
                      id={`section-${category.id}`}
                    >
                      <div className="product_list-title">
                        <h2>{category.name}</h2>
                      </div>
                      <div className="row product_data">
                        {meals &&
                          meals
                            .filter((el) => {
                              return el.category_id === category.id;
                            })
                            .map((meal) => {
                              if (meal.price !== "0") {
                                return (
                                  <ProductListItem
                                    key={meal.id}
                                    meal={meal}
                                    onAddedToCart={this.handleCart}
                                  />
                                );
                              }
                            })}
                      </div>
                      {category.child_categories &&
                        category.child_categories.map((val, i) => {
                          const products = meals.filter((el) => {
                            return el.category_id === val.id;
                          });
                          if (products.length > 0) {
                            return (
                              <React.Fragment>
                                <div
                                  className="product_list-title sub_category"
                                  key={val.id}
                                >
                                  <h3>{val.name}</h3>
                                </div>
                                <div className="row">
                                  {meals &&
                                    meals
                                      .filter((el) => {
                                        return el.category_id === val.id;
                                      })
                                      .map((meal, i) => {
                                        if (meal.price !== "0") {
                                          return (
                                            <ProductListItem
                                              key={i}
                                              meal={meal}
                                              onAddedToCart={this.handleCart}
                                            />
                                          );
                                        }
                                      })}
                                </div>
                              </React.Fragment>
                            );
                          }
                        })}
                    </section>
                  </React.Fragment>
                </>
              ))
            : times(7, Number).map((id) => (
                <div className="row my-4" key={id}>
                  <div className="col-md-12 pl-2">
                    <Skeleton variant="text" width={"18%"} height={"50px"} />
                  </div>
                  {times(7, Number).map((idx) => (
                    <div className={"col-md-3 p-3 my-1"} key={idx}>
                      <Box width={"100%"} borderRadius={10}>
                        <Skeleton variant="rect" width={"100%"} height={250} />
                        <Skeleton variant={"text"} width={"60%"} />
                        <Skeleton variant={"text"} width={"100%"} />
                        <Skeleton variant={"text"} width={"30%"} />
                      </Box>
                    </div>
                  ))}
                </div>
              ))}
          {load ? (
            <div className="spinner d-flex justify-content-center">
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}
