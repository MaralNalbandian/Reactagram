import React from "react";
import axios from "axios";
import { getFromStorage, setInStorage } from "../utils/storage";
import validateUserIdToken from './utils/validateToken'

export class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      signInError: "",
      signInEmail: "",
      signInPassword: "",
      token: ""
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
    const token = getFromStorage("the_main_app").userIdToken;
    if (validateUserIdToken()){
      console.log('YEP')
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
            userIdToken: json.userIdToken
          });
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInEmail: "",
            signInPassword: "",
            token: json.token,
            userIdToken: json.userIdToken
          });
        } else
          this.setState({
            signInError: json.message,
            isLoading: false
          });
      });
  }

  logout() {
    localStorage.clear();
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

  emailRef = React.createRef();
  passRef = React.createRef();

  render() {
    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
    } = this.state;

    if (isLoading) {
      return (
        <div>
          <p>Loading...</p>
        </div>
      );
    }

    if (token == "") {
      return (
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
            <button onClick={this.onSignUp}>Sign Up</button>
          </div>
        </React.Fragment>
      );
    }

    return (
      // <MuiThemeProvider>
      <React.Fragment>
        <div>
          <p>Account</p>
          <button onClick={this.logout}>Logout</button>
        </div>
      </React.Fragment>
      // </MuiThemeProvider>
    );
  }
}

const navStyle = {
  color: "grey"
};
const styles = {
  button: {
    margin: 15
  }
};

export default Login;
