import React from "react";
<<<<<<< HEAD
import { getFromStorage, setInStorage } from "../utils/storage";
import Home from "./Home";
=======
import validateUserIdToken from './utils/validateToken'
>>>>>>> develop

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
<<<<<<< HEAD
      signUpName: ""
=======
      token: "",
      emailTooLong: false,
      passwordTooLong: false,
>>>>>>> develop
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

<<<<<<< HEAD
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
=======
  async componentDidMount() {
    if (await validateUserIdToken()){
      const token = JSON.parse(localStorage.getItem("the_main_app")).userIdToken;
      this.setState({
        token,
        isLoading: false
      });
    //If token is not valid/does not exist, redirect to the sign up page
    } else {
      this.setState({
        isLoading: false
      });
>>>>>>> develop
    }
  }
  onTextboxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value
    });
    if (event.target.value.length === 250){
      this.setState({signInError: "Error: Email must be 250 characters or less"})
    } else {
      this.setState({signInError: ""})
    }
  }
  onTextboxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value
    });
    if (event.target.value.length === 250){
      this.setState({signInError: "Error: Password must be 250 characters or less"})
    } else {
      this.setState({signInError: ""})
    }
  }

  onSignUp() {
    window.location.assign("/register")
  }

  onSignIn() {
    //Grab state
    const { signInEmail, signInPassword } = this.state;

    this.setState({
      isLoading: true
    });

    //Post request to backend
    fetch(process.env.REACT_APP_BACKEND_WEB_ADDRESS + "/api/user/login", {
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
<<<<<<< HEAD
          setInStorage("the_main_app", {
            token: json.token,
            userIdtoken: json.userIdtoken
          });
=======
          localStorage.setItem("the_main_app", JSON.stringify({
            token: json.token,
            userIdToken: json.userIdToken
          }));
>>>>>>> develop
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInEmail: "",
            signInPassword: "",
            token: json.token,
<<<<<<< HEAD
            userIdtoken: json.userIdtoken
=======
            userIdToken: json.userIdToken
>>>>>>> develop
          });
        } else
          this.setState({
            signInError: json.message,
            isLoading: false
          });
      });
  }

  logout() {
<<<<<<< HEAD
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

=======
    localStorage.clear();
    this.setState({token: ""})
  }

  emailRef = React.createRef();
  passRef = React.createRef();

>>>>>>> develop
  render() {
    const {
      isLoading,
      token,
      signInError,
      signInEmail,
<<<<<<< HEAD
      signInPassword
=======
      signInPassword,
>>>>>>> develop
    } = this.state;

    if (isLoading) {
      return (
        <div class="loading">
          <p>Loading...</p>
        </div>
      );
    }

    if (token === "") {
      return (
<<<<<<< HEAD
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
=======
        <React.Fragment>
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
                maxLength="250"
                onChange={this.onTextboxChangeSignInEmail}
              />
              <br />
              <input
                type="password"
                placeholder="Password"
                value={signInPassword}
                maxLength="250"
                onChange={this.onTextboxChangeSignInPassword}
              />
              <br />
              <button onClick={this.onSignIn}>Sign In</button>
            </div>
            <button onClick={this.onSignUp}>Sign Up</button>
>>>>>>> develop
          </div>

<<<<<<< HEAD
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

=======
>>>>>>> develop
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
