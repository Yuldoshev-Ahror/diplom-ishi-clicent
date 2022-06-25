import React from "react";
import Header from "../header";
import ErrorIndicator from "../error-indicator";
import Footer from "../footer";
import { connect } from "react-redux";
import DeleverService from "../../services/delever-service";
import OrderCard from "../order-card";
import { Link } from "react-router-dom";
import { status } from "../../services/status";
import Skeleton from "@material-ui/lab/Skeleton";
import { times } from "lodash";
import Box from "@material-ui/core/Box";

const limit = 8;

class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
      req: false,
      orders: [],
      empty: false,
      page: 1,
      user: this.props.user,
    };
  }

  componentDidMount() {
    this.handleGetOrders();
  }

  handleGetOrders = () => {
    const { user, page, orders } = this.state;
    const access_token = localStorage.getItem("access_token");
    if (user) {
      const deleverService = new DeleverService();
      deleverService
        .getOrders(access_token, user.id, {
          limit,
          page,
        })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw res;
          }
        })
        .then((data) => {
          this.setState({ isOpen: true });
          this.setState({ req: true });
          if (data.orders !== null) {
            this.setState({ orders: [...this.state.orders, ...data.orders] });
          } else {
            if (orders.length === 0) {
              this.setState({ empty: true });
            }
          }
          this.setState({ page: this.state.page + 1 });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  loadData = () => {
    this.setState({ isOpen: false });
    this.handleGetOrders();
  };

  render() {
    // if (!this.props.location) return <ErrorIndicator />;
    const { orders, isOpen, empty } = this.state;
    return (
      <>
        <Header />

        {!empty ? (
          <div
            className="container order_info"
            id="top"
            style={{ minHeight: "60vh" }}
          >
            <h3 className={`ml-3 mt-5`}>
              <b>Мои Заказы</b>
            </h3>
            <div className="row my-3">
              {orders.length > 0
                ? orders.map((order, i) => (
                    <div
                      key={i}
                      className="col-xl-3 col-md-4 col-sm-6 col-12 my-1 order_card"
                    >
                      <Link
                        to={{
                          pathname: "/order-list",
                          state: {
                            orderId: order._id,
                            total: order.order_amount,
                            delivery_price: order.co_delivery_price,
                            order_number: order.external_order_id,
                          },
                        }}
                        className={`text-decoration-none hoverable`}
                      >
                        <OrderCard
                          date={order.created_at}
                          order_number={order.external_order_id}
                          total={order.order_amount}
                          status={status[order.status_id]}
                          delivery_price={order.co_delivery_price}
                          branch={order.steps[0].branch_name}
                        />
                      </Link>
                    </div>
                  ))
                : times(8, Number).map((idx) => (
                    <div
                      className={"col-xl-3 col-md-4 col-sm-6 col-12 p-3 my-1"}
                      key={idx}
                    >
                      <Box width={"100%"} height={"200px"} borderRadius={10}>
                        <Skeleton variant={"text"} width={"60%"} />
                        <div className="d-flex justify-content-between mt-3">
                          <Skeleton variant={"text"} width={"20%"} />
                          <Skeleton variant={"text"} width={"50%"} />
                        </div>
                        <div className="d-flex justify-content-between mt-3">
                          <Skeleton variant={"text"} width={"30%"} />
                          <Skeleton variant={"text"} width={"30%"} />
                        </div>
                        <div className="d-flex justify-content-between mt-3">
                          <Skeleton variant={"text"} width={"25%"} />
                          <Skeleton variant={"text"} width={"35%"} />
                        </div>
                        <div className="d-flex justify-content-between mt-3">
                          <Skeleton variant={"text"} width={"25%"} />
                          <Skeleton variant={"text"} width={"35%"} />
                        </div>
                      </Box>
                    </div>
                  ))}
            </div>
            {orders.length < 8 ? (
              ""
            ) : (
              <div className="row">
                <div className="col-md-4 offset-md-4 d-flex justify-content-center align-items-center">
                  {isOpen ? (
                    <button
                      className={`btn btn-outline-danger`}
                      onClick={this.loadData}
                    >
                      Посмотреть еще
                    </button>
                  ) : (
                    <div className="spinner-border text-danger" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="order_info d-flex justify-content-center align-items-center">
            <h1 className="text-center mt-4">У вас нет заказов</h1>
          </div>
        )}
        <Footer />
      </>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    user: state.profile.user,
  };
};

export default connect(mapStateToProps, null)(Order);
