import React, { Component } from "react";
import DeleverService from "../services/delever-service";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import { setUser } from "../redux/actions/authActions/authActions";
import { connect } from "react-redux";
import CancelIcon from "@material-ui/icons/Cancel";
import axios from "axios";
import { Router } from "react-router-dom";

import { Button, Container } from "react-bootstrap";
import { Box, Typography, Grid, CircularProgress } from "@material-ui/core";
import {
  YMaps,
  SearchControl,
  Placemark,
  GeolocationControl,
  Map,
} from "react-yandex-maps";
import { AiOutlineClose } from "react-icons/ai";
import { clean } from "../redux/actions/cartActions/cardAction";
import { toast } from "react-toastify";

class AddressPage extends Component {
  constructor(props) {
    super(props);
    this.infoAddress = React.createRef();
    this.state = {
      lat: 0,
      lng: 0,
      showMap: false,
      isLoading: false,
      show: false,
      deleteShow: false,
      myAddress: [],
      page: 1,
      user: this.props.user,
      setOpenDelete: false,
      setOpenAddress: false,
    };
  }
  deleverService = new DeleverService();

  handleOpenDelete = () => {
    this.setState((prevState) => ({ deleteShow: !prevState.deleteShow }));
  };
  handleCloseDelete = () => {
    this.setState({ deleteShow: false });
  };
  componentDidMount() {
    this.handleGeoLocation();
    this.handleGetAddress();
  }

  handleGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
    }
  };

  handleGetAddress = () => {
    const { myAddress } = this.state;
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
  onClickMap() {
    const { lat, lng } = this.state;
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
  }

  handleRemoveAddress = (id) => {
    const access_token = localStorage.getItem("access_token");
    this.deleverService
      .removeAddress(access_token, id)

      .then((res) => {
        if (res) {
          toast.success("Удален");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          return res;
        } else {
          throw res;
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => this.setState({ isLoading: false }));
  };
  handleAddressSubmit = (e) => {
    e.preventDefault();
    this.setState({ isLoading: true });
    const data = new FormData(e.target);
    const address = data.get("address");
    const apartment = data.get("apartment");
    const building = data.get("building");
    const description = data.get("description");
    const floor = data.get("floor");
    const name = data.get("name");
    const lat = this.state.lat;
    const long = this.state.lng;

    this.deleverService
      .addAddress(
        {
          address,
          building,
          description,
          apartment,
          floor,
          name,
          customer_id: this.props.user.id,
          location: { lat: lat, long: long },
        },
        localStorage.getItem("access_token")
      )
      .then((res) => {
        if (res) {
          this.closeModal();
          toast.success("Добавлен");
          this.setState({ isLoading: false });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          return res;
        } else {
          toast.error("Ошибка");
          this.setState({ isLoading: false });

          throw res;
        }
      })

      .catch((err) => {
        console.log(err);
      })
      .finally(() => this.setState({ isLoading: false }));
  };

  handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value,
    });
  };

  confirmDeleteAddress = () => {
    this.handleRemoveAddress();
  };

  deleteAddress = (id) => {
    this.openModal();
  };

  openModal() {
    this.setState((prevState) => ({ show: !prevState.show }));
  }
  closeModal() {
    this.setState({ show: false });
  }

  render() {
    const { user } = this.props;

    const { lat, lng, address, myAddress, isLoading } = this.state;
    return (
      <>
        <div className="user-page">
          <Container>
            <div className="addressPage">
              <div className="add">
                <button className="add_btn" onClick={() => this.openModal()}>
                  <ControlPointIcon className="add_icon" />
                  <span className="btn_text">Добавить адрес</span>
                </button>
              </div>
              <Grid container spacing={2}>
                {myAddress.customer_addresses?.map((item, index) => (
                  <Grid item xs={12} md={4} sm={6}>
                    <div className="item">
                      <div className="header">
                        <span>{item.name}</span>
                        <div>
                          <button
                            className="delete_btn"
                            onClick={() => {
                              this.handleRemoveAddress(item.id);
                            }}
                          >
                            {isLoading ? (
                              <CircularProgress
                                color="white"
                                style={{
                                  width: "23px",
                                  height: "23px",
                                }}
                              />
                            ) : (
                              <CancelIcon className="delete_icon" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="body">
                        <span>{item.address}</span>
                      </div>
                    </div>
                  </Grid>
                ))}
              </Grid>
            </div>
          </Container>
        </div>
        {this.state.deleteShow && (
          <div className="address_modal-wrapper">
            <div className="delete_modal-holder">
              <h4 className="delete_txt"> Вы точно хотите удалить адрес?</h4>
              <div className="buttons">
                <button
                  size="large"
                  variant="outlined"
                  onClick={() => this.handleCloseDelete()}
                  className="btn btn_white text-white"
                >
                  Нет
                </button>
                <button
                  size="large"
                  className="btn btn_white text-white"
                  onClick={this.handleRemoveAddress}
                >
                  Да
                </button>
              </div>
            </div>
          </div>
        )}

        {this.state.show && (
          <div className="address_modal-wrapper">
            <div className="address_modal-holder">
              <div className="auth_address">
                <form
                  className="address_form"
                  onSubmit={this.handleAddressSubmit}
                >
                  <button
                    onClick={() => this.closeModal()}
                    className="btn close_btn"
                  >
                    <AiOutlineClose />
                  </button>
                  <Typography variant="h4" component="h3">
                    Адрес доставки
                  </Typography>
                  <span className="input_txt">Выбранный адрес</span>
                  <input
                    name="address"
                    placeholder="Адрес"
                    variant="outlined"
                    required
                    fullWidth
                    value={address}
                    className="address_input"
                    onChange={this.handleChange}
                  />
                  <Box style={{ marginTop: "16px" }}>
                    <span>Наименование</span>
                    <input
                      name="name"
                      placeholder="Наименование"
                      variant="outlined"
                      required
                      fullWidth
                      className="address_input"
                    />
                  </Box>
                  <Box className="input">
                    <span>Ориентир</span>
                    <input
                      defaultValue={user.description}
                      name="description"
                      placeholder="Тариф по адресу"
                      variant="outlined"
                      fullWidth
                      className="address_input"
                      required
                    />
                  </Box>
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
                      />
                    </Box>
                  </Box>

                  {!isLoading ? (
                    <button
                      size="large"
                      type="submit"
                      className="btn text_white add_list"
                    >
                      Подтвердить местонахождение
                    </button>
                  ) : (
                    <button
                      className="btn btn_spin text_white add_list"
                      type="button"
                      disabled
                    >
                      <span
                        className="spinner-border spinner-border-sm "
                        role="status"
                        aria-hidden="true"
                      ></span>
                    </button>
                  )}
                </form>
                <div className="my-3 yandex_map">
                  <YMaps
                    query={{
                      apikey: "90eb5921-cb43-46fe-8f99-8d129c465be7",
                    }}
                  >
                    <Map
                      height="450px"
                      onClick={(e) => {
                        this.setState({
                          lat: e.get("coords")[0],
                          lng: e.get("coords")[1],
                        });
                        this.onClickMap();
                      }}
                      state={{
                        center: [lat, lng],
                        zoom: 16,
                        controls: ["zoomControl", "fullscreenControl"],
                      }}
                      modules={[
                        "control.ZoomControl",
                        "control.FullscreenControl",
                      ]}
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
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressPage);
