import React from "react";
import "./styles/main.css";
import "./styles/bootstrap.css"; // edit
import "./styles/my-style.css";
import { Switch, Route, useHistory } from "react-router-dom";

// import pages
import Home from "./components/pages/home";
import Cart from "./components/pages/cart";
import Branches from "./components/pages/branches";
import Contacts from "./components/pages/contacts";
import About from "./components/pages/about";
import Profile from "./components/pages/profile";
import Order from "./components/pages/order";
import Address from "./components/pages/address";

import OrderList from "./components/pages/order_list";
import { setUser } from "./redux/actions/authActions/authActions";
import { connect } from "react-redux";
import DeleverService from "./services/delever-service";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer } from "react-toastify";
import { saveUser } from "./libs/localStorage";
function App({ setUser, user }) {
  const history = useHistory();
  React.useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    if (access_token && access_token !== "undefined") {
      const deleverService = new DeleverService();
      deleverService
        .getProfile(access_token)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            if (res.status === 401) {
              deleverService
                .refresh(refresh_token)
                .then((res) => {
                  if (res.ok) {
                    return res.json();
                  } else {
                    throw res;
                  }
                })
                .then((data) => {
                  saveUser(data.access_token, data.refresh_token);
                })
                .catch((error) => {
                  error.json().then((body) => {
                    console.log(body);
                  });
                });
            } else {
              throw res;
            }
          }
        })
        .then((data) => {
          setUser(data);
        })
        .catch((error) => {
          error.json().then((body) => {
            console.log(body);
          });
        });
    } else {
      setUser(null)
      history.push('/')
    }
  }, []);

  return (
    <div className="app">
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/checkout" component={user ? Cart : ""} />
        <Route path="/branches" component={Branches} />
        <Route path="/contacts" component={Contacts} />
        <Route path="/about" component={About} />
        <Route path="/order" component={Order} />
        <Route path="/order-list" component={OrderList} />
        <Route path="/profile" component={Profile} />
        <Route path="/address" component={Address} />
      </Switch>
      <ToastContainer />
    </div>
  );
}

let mapDispatchToProps = (dispatch) => {
  return {
    setUser: (data) => {
      dispatch(setUser(data));
    },
  };
};
let mapStateToProps = (state) => {
  return {
    user: state.profile.user,
    cartItems: state.card.cartItems,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
