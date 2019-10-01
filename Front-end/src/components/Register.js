import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import Login from "./Login";
import Nav from "./Nav";
import axios from "axios";
import { HardwarePhonelinkOff } from "material-ui/svg-icons";
import { Link } from "react-router-dom";

import { getFromStorage, setInStorage } from "../utils/storage";
export class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      signUpError: "",
      signInError: "",
      signInEmail: "",
      signInPassword: "",
      signUpName: "",
      signUpEmail: "",
      signUpPassword: ""
    };
    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(
      this
    );
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(
      this
    );
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(
      this
    );
    this.onTextboxChangeSignUpName = this.onTextboxChangeSignUpName.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(
      this
    );

    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage("the_main_app");
    if (obj && obj.token) {
      const { token } = obj; //same as
      // const token = obj.token;
      if (token) {
        //Verify token
        fetch("http://localhost:80/api/user/verify?token=" + token)
          .then(res => res.json())
          .then(json => {
            if (json.success) {
              this.setState({
                token,
                isLoading: false
              });
            } else {
              this.setState({
                isLoading: false
              });
            }
          });
      } else {
        this.setState({
          isLoading: false
        });
      }
    }
  }

  onTextboxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value
    });
  }
  onTextboxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value
    });
  }
  onTextboxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value
    });
  }
  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value
    });
  }
  onTextboxChangeSignUpName(event) {
    this.setState({
      signUpName: event.target.value
    });
  }

  onSignUp() {
    //Grab state
    const { signUpName, signUpEmail, signUpPassword } = this.state;

    this.setState({
      isLoading: true
    });

    //Post request to backend
    fetch("http://localhost:80/api/user/register", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpEmail: "",
            signUpName: "",
            signUpPassword: ""
          });
        } else
          this.setState({
            signUpError: json.message,
            isLoading: false
          });
      });
  }

  onSignIn() {
    //Grab state
    const { signInEmail, signInPassword } = this.state;

    this.setState({
      isLoading: true
    });

    //Post request to backend
    fetch("http://localhost:80/api/user/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setInStorage("the_main_app", { token: json.token });
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInEmail: "",
            signInPassword: "",
            token: json.token
          });
        } else
          this.setState({
            signInError: json.message,
            isLoading: false
          });
      });
  }

  logout() {
    this.setState({
      isLoading: true
    });
    const obj = getFromStorage("the_main_app");
    if (obj && obj.token) {
      const { token } = obj; //same as  // const token = obj.token;

      if (token) {
        //Verify token
        fetch("http://localhost:80/api/user/logout?token=" + token)
          .then(res => res.json())
          .then(json => {
            if (json.success) {
              this.setState({
                token: "",
                isLoading: false
              });
            } else {
              this.setState({
                isLoading: false
              });
            }
          });
      } else {
        this.setState({
          isLoading: false
        });
      }
    }
  }

  nameRef = React.createRef();
  passRef = React.createRef();
  emailRef = React.createRef();

  state = {};

  checkUser = event => {
    event.preventDefault();

    axios("http://localhost:80/api/user/register", {
      method: "post",
      data: {
        name: this.nameRef.current.value,
        email: this.emailRef.current.value,
        password: this.passRef.current.value
      }
    }).then(response => console.log(response.data));
    // this.setState({ name: response.data.name });
    // this.setState({ lastname: response.data.lastname });
    // this.setState({ email: response.data.email });
    // this.setState({ password: response.data.password });
    // })
    // .catch(error => {
    //   console.error(error);
    // });
  };

  render() {
    const {
      isLoading,
      token,
      signInError,
      signUpError,
      signInEmail,
      signInPassword,
      signUpName,
      signUpEmail,
      signUpPassword
    } = this.state;

    if (isLoading) {
      return (
        <div>
          <p>Loading...</p>
        </div>
      );
    }

    if (!token) {
      return (
        <React.Fragment>
          <Nav />
          <div>
            <div>
              {signInError ? <p>{signInError}</p> : null}
              <p>Sign In</p>
              <label>Email:</label>
              <br />
              <input
                type="email"
                placeholder="Email"
                value={signInEmail}
                onChange={this.onTextboxChangeSignInEmail}
              />
              <br />
              <input
                type="password"
                placeholder="Password"
                value={signInPassword}
                onChange={this.onTextboxChangeSignInPassword}
              />
              <br />
              <button onClick={this.onSignIn}>Sign In</button>
            </div>
            <br />
            <br />
            <br />
            <br />
            <div>
              {signUpError ? <p>{signUpError}</p> : null}
              <p>Sign Up</p>
              <input
                type="text"
                placeholder="Name"
                value={signUpName}
                onChange={this.onTextboxChangeSignUpName}
              />
              <br />
              <input
                type="email"
                placeholder="Email"
                value={signUpEmail}
                onChange={this.onTextboxChangeSignUpEmail}
              />
              <br />
              <input
                type="password"
                placeholder="Password"
                value={signUpPassword}
                onChange={this.onTextboxChangeSignUpPassword}
              />
              <br />
              <button onClick={this.onSignUp}>Sign Up</button>
            </div>
          </div>
        </React.Fragment>
      );
    }

    return (
      // <MuiThemeProvider>
      <React.Fragment>
        <Nav />
        <div>
          <p>Account</p>
          <button onClick={this.logout}>Logout</button>
        </div>
        {/* <form className="login-box" onSubmit={this.checkUser}>
          <h1>Register</h1>
          <div className="textbox">
            <input
              name="name"
              ref={this.nameRef}
              type="text"
              placeholder="Name"
            ></input>
          </div>

          <div className="textbox">
            <input
              name="email"
              ref={this.emailRef}
              type="text"
              placeholder="Email"
            ></input>
          </div>
          <div className="textbox">
            <input
              name="password"
              ref={this.passRef}
              type="password"
              placeholder="Password"
            ></input>
          </div>

          <input class="btn" type="submit" value="Register"></input>

          <h4>Have an account?</h4>
          <Link style={navStyle} to="/login">
            <h4>Login</h4>
          </Link>
        </form> */}
      </React.Fragment>
      // </MuiThemeProvider>
    );
  }
}
const navStyle = {
  color: "grey"
};
const navstyles = {
  button: {
    margin: 15
  }
};

export default Register;
