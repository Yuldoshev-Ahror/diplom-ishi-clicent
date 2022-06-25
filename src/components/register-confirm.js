import React, { Component } from "react";
import { AiOutlineClose } from "react-icons/ai";
import DeleverService from '../services/delever-service';
import { setUser } from '../redux/actions/authActions/authActions';
import { connect } from "react-redux";
import { saveUser } from "./../libs/localStorage";

class RegisterConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      code: "",
      errorText: ""
    }
  }

  deleverService = new DeleverService();
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }




  handleSubmit = (e) => {
    e.preventDefault();
    const phone = this.props.phone;
    const { code } = this.state;
    this.setState({ isLoading: true });
    if (this.props.type === "login-confirm") {
      this.deleverService.loginConfirm({ code, phone }).then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res;
        }
      }).then((data) => {
        saveUser(data.access_token, data.refresh_token);
        this.props.setUser(data);
        this.setState({ isLoading: false });
        this.props.closeModal();
      }).catch((error) => {
        error.json().then((body) => {
          this.setState({ errorText: body.Error.Message })
        });
        this.setState({ isLoading: false });
      });
    }
    if (this.props.type === 'register-confirm') {
      this.deleverService.registerConfirm({ code, phone }).then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res;
        }
      }).then((data) => {
        saveUser(data.access_token, data.refresh_token);
        this.props.setUser(data);
        this.setState({ isLoading: false });
        this.props.closeModal();
      }).catch((error) => {
        error.json().then((body) => {
          this.setState({ errorText: body.Error.Message })
        });
        this.setState({ isLoading: false });
      });
    }

  }



  render() {
    const { code, isLoading, errorText } = this.state;

    return (

      <div className="login_modal-holder">

        <div className="auth_form">
          <button onClick={this.props.closeModal} className="btn close_btn">
            <AiOutlineClose />
          </button>
          <h4>Потверждение</h4>
          <p>Код отправлен на ваш телефон</p>
          {errorText ? <p className="text-danger">{errorText}</p> : ""}
          <form onSubmit={this.handleSubmit}>
            <input type="tel" name="phone" value={this.props.phone} disabled required />
            <input type="code" name="code" value={code} placeholder="Код" onChange={this.handleChange} required />
            <div className="login_btn">
              {!isLoading ? <button className="btn text-white" type="submit">Отправить</button>
                : <button className="btn btn_spin" type="button" disabled>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                </button>}
            </div>
          </form>
        </div>
      </div>

    );
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    setUser: (data) => {
      dispatch(setUser(data));
    }
  }
}

export default connect(null, mapDispatchToProps)(RegisterConfirm);
