import React, { Component } from "react";
import DeleverService from "../services/delever-service";
import { setUser } from "../redux/actions/authActions/authActions";
import { connect } from "react-redux";
import { toast } from "react-toastify";

class ProfilePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorText: "",
      isLoading: false,
    };
  }

  deleverService = new DeleverService();

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ isLoading: true });
    const data = new FormData(e.target);
    const name = data.get("name");
    const phone = this.props.user.phone;
    this.deleverService
      .profileUpdate(
        { name, phone },
        this.props.user.id,
        localStorage.getItem("access_token")
      )
      .then((res) => {
        if (res.ok) { 
          return res.json();
        } else {
          throw res;
        }
      })
      .then((data) => {
        this.props.setUser(data);
        localStorage.setItem("access_token", data.access_token);
        toast.success("Изменено");
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        error.json().then((body) => {
          this.setState({ errorText: body.Error.Message });
        });
        this.setState({ isLoading: false });
      });
  };
  render() {
    const { isLoading, errorText } = this.state;
    const { user } = this.props;

    return (
      <>
        <div className="container">
          {user ? (
            <div className="row profile_form">
              <h2>Личный кабинет</h2>
              <p className="text-danger">{errorText}</p>
              <form onSubmit={this.handleSubmit}>
                <input
                  name="name"
                  type="text"
                  defaultValue={user.name}
                  placeholder="Имя"
                  required
                />
                <input
                  name="phone"
                  type="text"
                  disabled
                  defaultValue={user.phone}
                  placeholder="Телефон номер"
                  required
                />

                {!isLoading ? (
                  <button className="btn text-white">Обновить</button>
                ) : (
                  <button className="btn btn_spin" type="button" disabled>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  </button>
                )}
              </form>
            </div>
          ) : (
            <div class="text-center">
              <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          )}
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
