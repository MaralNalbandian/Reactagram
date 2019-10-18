import React from "react";
import { getFromStorage, setInStorage } from "../utils/storage";
import Home from "./Home";

export class Login extends React.Component {
  //This code is based on a solution by "Keith, the Coder" on Youtube
  //See https://youtu.be/s1swJLYxLAA

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      signUpError: "",
      signInError: "",
      signInEmail: "",
      signInPassword: "",
      signUpName: ""
    };
    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(
      this
    );
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(
      this
    );

    this.onSignIn = this.onSignIn.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    //Verify token
    const obj = getFromStorage("the_main_app");
    if (obj && obj.token) {
      const { token } = obj;

      if (token) {
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
          setInStorage("the_main_app", {
            token: json.token,
            userIdtoken: json.userIdtoken
          });
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInEmail: "",
            signInPassword: "",
            token: json.token,
            userIdtoken: json.userIdtoken
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
    //Verify token
    const obj = getFromStorage("the_main_app");
    if (obj && obj.token) {
      const { token } = obj;
      if (token) {
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

  render() {
    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword
    } = this.state;

    if (isLoading) {
      return (
        <div class="loading">
          <p>Loading...</p>
        </div>
      );
    }

    if (!token) {
      return (
        <div class="container">
          <div class="warning">{signInError ? <p>{signInError}</p> : null}</div>
          <h1>Login</h1>

          <div class="login-box">
            <input
              type="email"
              placeholder="Email"
              value={signInEmail}
              onChange={this.onTextboxChangeSignInEmail}
            />
          </div>

          <div class="login-box">
            <input
              type="password"
              placeholder="Password"
              value={signInPassword}
              onChange={this.onTextboxChangeSignInPassword}
            />
          </div>
          <div class="login-box">
            <button class="button" onClick={this.onSignIn}>
              Sign In
            </button>
          </div>
          <div class="login-links">
            <a class="b1" href="/register">
              CREATE AN ACCOUNT
            </a>
          </div>
        </div>
      );
    }

    return (
      <div>
        <Home />
        <button class="logout-btn" onClick={this.logout}>
          Logout
        </button>
      </div>
    );
  }
}

export default Login;
