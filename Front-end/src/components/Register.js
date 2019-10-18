import React from "react";
import validateUserIdToken from "./utils/validateToken";
import { getFromStorage } from "../utils/storage";

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
      signUpPassword: "",
      token: ""
    };
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(
      this
    );
    this.onTextboxChangeSignUpName = this.onTextboxChangeSignUpName.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(
      this
    );

    this.onSignUp = this.onSignUp.bind(this);
  }

  async componentDidMount() {
    if (await validateUserIdToken()) {
      const token = JSON.parse(localStorage.getItem("the_main_app"))
        .userIdToken;
      this.setState({
        token,
        isLoading: false
      });
      //If token is not valid/does not exist, redirect to the sign up page
    } else {
      this.setState({
        isLoading: false
      });
    }
  }

  logout() {
    localStorage.clear();
    try {
      this.setState({ token: "" });
    } catch (error) {
      console.error(error);
    }
  }

  //Update state/textbox values
  onTextboxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value
    });
    if (event.target.value.length === 250) {
      this.setState({
        signUpError: "Error: Email must be 250 characters or less"
      });
    } else {
      this.setState({ signUpError: "" });
    }
  }
  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value
    });
    if (event.target.value.length === 250) {
      this.setState({
        signUpError: "Error: Password must be 250 characters or less"
      });
    } else {
      this.setState({ signUpError: "" });
    }
  }
  onTextboxChangeSignUpName(event) {
    this.setState({
      signUpName: event.target.value
    });
    if (event.target.value.length === 250) {
      this.setState({
        signUpError: "Error: Name must be 250 characters or less"
      });
    } else {
      this.setState({ signUpError: "" });
    }
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
    fetch(process.env.REACT_APP_BACKEND_WEB_ADDRESS + "/api/user/register", {
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

  onLogin() {
    window.location.assign("/login");
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

    if (signUpError === "Signed up") {
      return (
        <React.Fragment>
          <p>{signUpError}</p>
          <button class="button" onClick={this.onLogin}>
            Login
          </button>
        </React.Fragment>
      );
    }

    if (token === "") {
      return (
        <React.Fragment>
          <div>
            {signUpError ? <p>{signUpError}</p> : null}
            <h1>Sign Up</h1>

            <div class="input-box">
              <input
                type="text"
                placeholder="Name"
                value={signUpName}
                onChange={this.onTextboxChangeSignUpName}
              />
            </div>
            <div class="input-box">
              <input
                type="email"
                placeholder="Email"
                value={signUpEmail}
                onChange={this.onTextboxChangeSignUpEmail}
              />
            </div>

            <div class="input-box">
              <input
                type="password"
                placeholder="Password"
                value={signUpPassword}
                onChange={this.onTextboxChangeSignUpPassword}
              />
            </div>

            <button class="button" onClick={this.onSignUp}>
              Sign Up
            </button>
          </div>
        </React.Fragment>
      );
    }

    //If user is already logged in
    return (
      <React.Fragment>
        <p>Account - go to login screen to sign out</p>
        <button onClick={this.onLogin}>Login</button>
      </React.Fragment>
    );
  }
}

export default Register;
