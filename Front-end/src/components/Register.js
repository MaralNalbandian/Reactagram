import React, { Component } from "react";
import { getFromStorage, setInStorage } from "../utils/storage";
export class Register extends React.Component {
  //This code is based on a solution by "Keith, the Coder" on Youtube
  //See https://youtu.be/s1swJLYxLAA

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      signUpError: "",
      signUpName: "",
      signUpEmail: "",
      signUpPassword: ""
    };

    //Bind functions to compenents
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(
      this
    );
    this.onTextboxChangeSignUpName = this.onTextboxChangeSignUpName.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(
      this
    );

    this.onSignUp = this.onSignUp.bind(this);
    this.logout = this.logout.bind(this);
  }

  //For setting loading to false
  componentDidMount() {
    const obj = getFromStorage("the_main_app"); //Check storage for the token
    if (obj && obj.token) {
      const { token } = obj;
      //Verify token
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

  //Update state/textbox values
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

  /*
   *This function grabs the values stored in state and creates an API request to endpoint
   *User is informed of the response
   *
   */
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

  logout() {
    this.setState({
      isLoading: true
    });
    const obj = getFromStorage("the_main_app"); //Check storage for the token
    if (obj && obj.token) {
      const { token } = obj;
      //Verify token
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
      signUpError,
      signUpName,
      signUpEmail,
      signUpPassword
    } = this.state;

    if (isLoading) {
      return (
        <div class="loading">
          <p>Loading...</p>
        </div>
      );
    }

    if (!token) {
      //If there is no token, Sign up page is loaded
      return (
        <div class="container">
          <div class="warning">{signUpError ? <p>{signUpError}</p> : null}</div>
          <h1>Sign Up</h1>
          <div class="login-box">
            <input
              type="text"
              placeholder="Name"
              value={signUpName}
              onChange={this.onTextboxChangeSignUpName}
            />
          </div>
          <div class="login-box">
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={this.onTextboxChangeSignUpEmail}
            />
          </div>
          <div class="login-box">
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={this.onTextboxChangeSignUpPassword}
            />
          </div>
          <div class="login-box">
            <button class="button" onClick={this.onSignUp}>
              Sign Up
            </button>
          </div>
          <div class="login-links">
            <a class="b1" href="/login">
              HAVE AN ACCOUNT?
            </a>
          </div>
        </div>
      );
    }

    //If user is already logged in
    return (
      <div>
        <button class="logout-btn" onClick={this.logout}>
          Logout
        </button>
      </div>
    );
  }
}

export default Register;
