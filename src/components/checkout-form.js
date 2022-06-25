import React from "react";
import DeleverService from "../services/delever-service";
import { connect } from "react-redux";
import {
  YMaps,
  Map,
  SearchControl,
  Placemark,
  GeolocationControl,
} from "react-yandex-maps";
import axios from "axios";
import { clean } from "../redux/actions/cartActions/cardAction";
import cash from "../images/banknote.svg";
import payme from "../images/payme.svg";
import {
  CashIn,
  CreditCard,
  DefaultDelivery,
  PickUp,
  FastDelivery,
  TerminalIcon,
  CreditCardIcon,
  CashIcon,
  CalendarIcon,
  InstallmentIcon,
} from "../components/svg";
import click from "../images/click.svg";
import {
  Box,
  NativeSelect,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  DialogTitle,
} from "@material-ui/core";
import BranchDialog from "./branch-dialog";
import { FormControl } from "react-bootstrap";
import config from "../config";

class CheckoutForm extends React.Component {
  deleverService = new DeleverService();
  constructor(props) {
    super(props);
    this.infoAddress = React.createRef();
    const { cartItems, user, delivery_price, setDeliveryPrice } = this.props;
    this.state = {
      isLogin: false,
      isRegister: false,
      name: user.name,
      phone: null,
      address: "",
      building: "",
      apartment: "",
      floor: "",
      payment_method: "cash",
      comment: null,
      code: null,
      orderCreateDetail: null,
      orderCreated: false,
      loading: false,
      hasError: false,
      cartItems,
      lat: 0,
      lng: 0,
      showMap: false,
      showAlert: false,
      isLoading: false,
      disable: false,
      show: false,
      nearest_dealer: null,
      compute_distance: null,
      co_delivery_price: this.props.delivery_price,
      open: false,
      branches: [],
      myAddress: [],
      delivery_type: "delivery",
      branch_id: "",
      work_time_start: "",
      work_time_end: "",
      is_courier_call: "yes",
    };
  }

  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  componentDidMount() {
    if (this.state.cartItems.length === 0) this.setState({ disable: true });
    this.handleGeoLocation();
    this.deleverService.getTimeWorks().then((data) => {
      this.setState(
        {
          ...this.state,
          // work_time_start: data.work_hour_start,
          // work_time_end: data.work_hour_end,
          work_time_start: "00:00",
          work_time_end: "23:59",
        },
        () => {
          console.log("state==>", this.state);
        }
      );
    });
    this.handleGetAddress();
  }

  handleSelect = (event) => {
    const value = event.target.id;
    const name = event.target.name;

    this.setState({
      [name]: value,
    });
  };

  handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value,
    });
  };

  handleGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
    }
  };

  showPosition = (position) => {
    this.setState(
      {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      () => {
        this.onClickMap();
      }
    );
  };

  onHandleSubmit = (e, getTimeWorks) => {
    e.preventDefault();
    const { lat, lng, work_time_start, work_time_end } = this.state;

    if (lat === 0 && lng === 0) {
      this.setState({ showAlert: true });
      this.setState({
        errorText: `Нажмите на кнопку "Определить местоположения"`,
      });
      return;
    }

    const date = new Date();

    const startDate = new Date();
    startDate.setHours(work_time_start.split(":")[0]);
    startDate.setMinutes(work_time_start.split(":")[1]);

    const endDate = new Date();
    if (work_time_end.split(":")[0] < work_time_start.split(":")[0]) {
      endDate.setHours(work_time_end.split(":")[0]);
      endDate.setMinutes(work_time_end.split(":")[1]);
      endDate.setDate(date.getDate() + 1);
    } else {
      endDate.setHours(work_time_end.split(":")[0]);
      endDate.setMinutes(work_time_end.split(":")[1]);
    }

    if (date >= startDate && date <= endDate) {
      if (this.props.user) {
        this.setState({ disable: true });
        this.setState({ isLoading: true });
        const {
          address,
          comment,
          cartItems,
          payment_method,
          lat,
          lng,
          delivery_type,
          branch_id,
        } = this.state;
        const orderItems = [...cartItems];
        const order = {
          nearest_dealer: this.state.nearest_dealer,
          apartment: this.state.apartment,
          building: this.state.building,
          client_id: this.props.user.id,
          co_delivery_price: this.props.delivery_price,
          description: comment,
          extra_phone_number: this.props.user.phone,
          floor: this.state.floor,
          payment_type: payment_method,
          is_courier_call: this.state.is_courier_call === "yes",
          source: "website",
          delivery_type,
          steps: [
            {
              description: "",
              branch_id,
              products: orderItems.map((item) => {
                return {
                  category_id: item.category_id,
                  name: item.name,
                  price: item.price,
                  product_id: item._id,
                  quantity: item.count,
                };
              }),
            },
          ],
          to_address: address,
          to_location: {
            lat: lat,
            long: lng,
          },
        };
        const authorization = localStorage.getItem("access_token");
        this.deleverService
          .orderCreate(order, authorization)
          .then((res) => {
            this.setState({
              orderCreateDetail: res.detail,
              orderCreated: true,
              loading: false,
              cartItems: [],
            });
            this.props.clean();
            this.props.onCreate();
            this.props.setNum(res.order.external_order_id);
            this.setState({ isLoading: false });
            this.setState({ disable: false });
          })
          .catch((error) => {
            this.setState({ disable: false });
            this.setState({
              hasError: true,
              loading: false,
            });
            this.setState({ isLoading: false });
          });
      } else {
        this.setState({ isLogin: true });
      }
    } else {
      this.handleShow();
    }
  };

  handleRadioChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value,
    });
  };

  closeModal = () => {
    this.setState({ isLogin: false, isRegister: false });
  };

  changeBranchId = (id) => {
    this.setState({
      ...this.state,
      branch_id: id,
    });
  };

  register = (e) => {
    e.preventDefault();
    this.setState({ isLogin: false, isRegister: true });
  };

  onClickMap() {
    const { lat, lng, nearest_dealer } = this.state;
    console.log(lat, lng);
    axios({
      method: "get",
      url: "https://geocode-maps.yandex.ru/1.x/",
      params: {
        format: "json",
        apikey: "13b2041b-80b3-47fb-b10e-217ad5a09315",
        geocode: lng + "," + lat,
        lang: "ru-RU",
        results: 3,
      },
    }).then((body) => {
      var tempAddress =
        body.data.response.GeoObjectCollection.featureMember[0].GeoObject
          .metaDataProperty.GeocoderMetaData.Address.Components;
      let addressName = "";
      tempAddress.map((address, i) => {
        if (i !== 2) {
          addressName += address.name + ", ";
        }
      });

      this.setState({
        address: addressName,
      });
    });
    //nearest filial
    const authorization = localStorage.getItem("access_token");
    axios({
      method: "get",
      url: `${config.BACKEND_URL}/branches?long=${this.state.lng}&lat=${this.state.lat}`,
      headers: {
        Authorization: authorization,
      },
    })
      .then((res) => {
        this.setState({
          ...this.state,
          nearest_dealer: res.data.branches[0],
          branches: res.data.branches,
          branch_id: res.data.branches[0]._id,
        });
      })
      .catch((err) => {
        console.log(err);
      });

    if (nearest_dealer) {
      axios({
        method: "post",
        url: `${config.BACKEND_URL}/delivery_price`,
        headers: {
          Authorization: authorization,
        },
        data: {
          brnachLong: nearest_dealer.location.long,
          branchLat: nearest_dealer.location.lat,
          branch_id: nearest_dealer._id,
          lat: lat,
          long: lng,
        },
      })
        .then((res) => {
          this.props.setDeliveryPrice(res.data.price);
          this.setState({ ...this.state, co_delivery_price: res.data.price });
        })
        .catch((err) => {
          console.log(err);
        });
      this.setState({
        ...this.state,
        open: true,
      });
    }
  }
  handleGetAddress = () => {
    const access_token = localStorage.getItem("access_token");
    const deleverService = new DeleverService();
    deleverService
      .getAddress(access_token)
      .then((res) => {
        this.setState({
          ...this.state,
          myAddress: res,
        });
      })

      .catch((error) => {
        console.log(error);
      });
  };
  changeBranchId = (id) => {
    this.setState({
      ...this.state,
      branch_id: id,
    });
  };

  onCloseDialog(item) {
    this.setState({
      ...this.state,
      open: !item,
    });
  }

  handleChangeAddress = (e) => {
    const currentAddress = this.state.myAddress?.customer_addresses?.find(
      (item) => item.id == e.target.value
    );

    if (currentAddress) {
      this.onClickMap()
      this.setState({
        ...this.state,
        address: currentAddress.address,
        apartment: currentAddress.apartment,
        building: currentAddress.building,
        floor: currentAddress.floor,
        lat: currentAddress.location.lat,
        lng: currentAddress.location.long,
      });
    }
  };

  render() {
    const { user } = this.props;
    const {
      lat,
      lng,
      address,
      comment,
      name,
      showAlert,
      errorText,
      disable,
      myAddress,
      apartment,
      building,
      floor,
    } = this.state;
    return (
      <form className="checkout_form" onSubmit={this.onHandleSubmit}>
        <div className="checkout_form-box">
          <h2 className="text-center mb-4">Оформление заказа</h2>
          <h3 className="form_heading">Имя</h3>
          <div className="field_wrapper">
            <input
              type="text"
              name="name"
              id="name"
              required
              value={name}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="checkout_form-box">
          <h3 className="form_heading">Телефон номер</h3>
          <div className="field_wrapper">
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              disabled
              value={user.phone}
            />
          </div>
        </div>
        <div className="checkout_form-box">
          <h3 className="form_heading">Выберите тип оплаты</h3>
          <div className="radio_wrapper">
            <div className="radio_card">
              <input
                type="radio"
                name="payment_method"
                value="cash"
                id="cash"
                onChange={this.handleSelect}
                defaultChecked
              />
              <label htmlFor="cash">
                <span className="card_title">Наличные</span>
                <span className="card_content">
                  <img src={cash} className="cash" alt="Cash" />
                </span>
              </label>
            </div>
            <div style={{pointerEvents: "none", opacity: "0.4"}} className="radio_card">
              <input
                type="radio"
                name="payment_method"
                value="click"
                id="click"
                onChange={this.handleSelect}
              />
              <label htmlFor="click">
                <span className="card_title">Click</span>
                <span className="card_content">
                  <img src={click} className="click" alt="click" />
                </span>
              </label>
            </div>
            <div style={{pointerEvents: "none", opacity: "0.4"}} className="radio_card">
              <input
                type="radio"
                name="payment_method"
                value="payme"
                id="payme"
                onChange={this.handleSelect}
              />
              <label htmlFor="payme">
                <span className="card_title">Payme</span>
                <span className="card_content">
                  <img src={payme} className="payme" alt="Payme" />
                </span>
              </label>
            </div>
          </div>
        </div>
        <div className="checkout_form-box">
          <h3 className="form_heading">Выберите тип доставки</h3>
          <div className="radio_wrapper">
            <div className="radio_card">
              <input
                type="radio"
                name="delivery_type"
                value="delivery"
                id="delivery"
                onChange={this.handleSelect}
                onClick={() => {
                  this.infoAddress.current.scrollIntoView();
                  this.props.setDeliveryPrice(this.state.co_delivery_price);
                }}
                defaultChecked
              />
              <label htmlFor="delivery">
                <span className="card_title">Доставка</span>
                <span className="card_content">
                  <DefaultDelivery />
                </span>
              </label>
            </div>
            <div className="radio_card">
              <input
                type="radio"
                name="delivery_type"
                value="self-pickup"
                id="self-pickup"
                onChange={this.handleSelect}
                onClick={() => {
                  this.infoAddress.current.scrollIntoView();
                  this.props.setDeliveryPrice(0);
                }}
              />
              <label htmlFor="self-pickup">
                <span className="card_title">Самовызов</span>
                <span className="card_content">
                  <PickUp />
                </span>
              </label>
            </div>
          </div>
        </div>
        <div className="checkout_form-box">
          {this.state.delivery_type === "delivery" ? (
            <div className="radio_group">
              <input
                type="radio"
                value="yes"
                name="is_courier_call"
                onChange={this.handleRadioChange}
                defaultChecked
              />
              <span>Да</span>
              <input
                type="radio"
                value="no"
                name="is_courier_call"
                onChange={this.handleRadioChange}
              />
              <span>Нет</span>
            </div>
          ) : (
            ""
          )}
          <div className="field_wrapper">
            <div style={{ width: "100%" }}>
              <h3 className="form_heading">Адрес</h3>
              <input
                type="text"
                name="address"
                id="address"
                value={address}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="select_menu-holder">
              <h3 className="form_heading">Мои адреса</h3>
              <select
                className="select_menu"
                id="demo-customized-select-native"
                input={<input style={{ padding: "20px" }} />}
                onChange={this.handleChangeAddress}
                defaultValue="empty"
              >
                <option id="emty">Нет</option>
                {myAddress.customer_addresses?.map((item, index) => (
                  <option key={item.id} value={item.id}>
                    {item.name}: {item.address}
                  </option>
                ))}

              </select>
            </div>
          </div>
          <Box className="form_input">
            <Box>
              <span>Квартира</span>
              <input
                defaultValue={user.apartment}
                name="apartment"
                type="number"
                placeholder="0"
                variant="outlined"
                fullWidth
                className="address_input"
                required
                value={apartment}
                onChange={(e) => this.setState({ apartment: e.target.value })}
              />
            </Box>
            <Box>
              <span>Подезд</span>
              <input
                defaultValue={user.building}
                name="building"
                type="number"
                placeholder="0"
                variant="outlined"
                fullWidth
                className="address_input"
                required
                value={building}
                onChange={(e) => this.setState({ building: e.target.value })}
              />
            </Box>

            <Box>
              <span>Этаж</span>
              <input
                defaultValue={user.floor}
                name="floor"
                type="number"
                placeholder="0"
                variant="outlined"
                fullWidth
                className="address_input"
                required
                value={floor}
                onChange={(e) => this.setState({ floor: e.target.value })}
              />
            </Box>
          </Box>

          <div className="my-3 yandex-map">
            <YMaps
              query={{
                apikey: "90eb5921-cb43-46fe-8f99-8d129c465be7",
              }}
            >
              <Map
                onClick={(e) => {
                  this.setState({
                    lat: e.get("coords")[0],
                    lng: e.get("coords")[1],
                  });
                  this.onClickMap();
                }}
                onChange={(e) => {
                  this.setState({
                    lat: e.get("coords")[0],
                    lng: e.get("coords")[1],
                  });
                }}
                state={{
                  center: [lat, lng],
                  zoom: 16,
                  controls: ["zoomControl", "fullscreenControl"],
                }}
                modules={["control.ZoomControl", "control.FullscreenControl"]}
              >
                <GeolocationControl options={{ float: "left" }} />
                <SearchControl />
                <Placemark
                  options={{ iconColor: "#f5363e" }}
                  geometry={[lat, lng]}
                />
              </Map>
            </YMaps>
          </div>

          <h3 className="form_heading">Ближайший филиал</h3>
          <BranchDialog
            open={this.state.open}
            isOpen={(item) => this.onCloseDialog(item)}
            nearest_dealer={this.state.nearest_dealer}
            branches={this.state.branches}
            delivery_price={this.props.delivery_price}
            delivery_type={this.state.delivery_type}
            changeBranchId={this.changeBranchId}
            branch_id={this.state.branch_id}
            addressRef={this.infoAddress}
          />
          <div className="checkout_form-box">
            <h3 className="form_heading">Комментария</h3>
            <div className="field_wrapper">
              <textarea
                type="text"
                name="comment"
                id="phone"
                value={comment ? comment : ""}
                onChange={this.handleChange}
              />
            </div>
          </div>
        </div>

        {showAlert ? (
          <div className="alert_div">
            <p>{errorText}</p>
          </div>
        ) : (
          ""
        )}
        <div className="checkout_form-box">
          <div className="checkout_submit">
            <button className="btn">
              <span className="btn_text">Заказать</span>
            </button>
          </div>
        </div>
        <div>
          <Dialog
            open={this.state.show}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Заметка</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                На данный момент Ваш заказ не будет принят. Наше рабочее время с
                {" " + this.state.work_time_start} до {this.state.work_time_end}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleClose}
                className="notific_btn"
                autoFocus
              >
                Закрыть
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </form>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    user: state.profile.user,
    cartItems: state.card.cartItems,
  };
};

let mapDispatchToProps = (dispatch) => {
  return {
    clean: () => {
      dispatch(clean());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CheckoutForm);
