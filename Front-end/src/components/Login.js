import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import Nav from "./Nav";
import axios from "axios";
import { Link } from "react-router-dom";

import { ImageGradient } from "material-ui/svg-icons";

import { getFromStorage, setInStorage } from "../utils/storage";

export class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      signInError: "",
      signInEmail: "",
      signInPassword: ""
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

  emailRef = React.createRef();
  passRef = React.createRef();

  state = {};

  checkUser = event => {
    event.preventDefault();

    axios("http://localhost:80/api/user/login", {
      method: "post",
      data: {
        email: this.emailRef.current.value,
        password: this.passRef.current.value
      }
    }).then(response => console.log(response.data));
  };

  render() {
    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword
    } = this.state;
    if (!token) {
      return (
        // <MuiThemeProvider>
        <React.Fragment>
          <Nav />
          {/* onSubmit={this.checkUser} */}
          <form className="login-box" method="POST">
            {signInError ? <p>{signInError}</p> : null}
            <h1>Login</h1>
            <div className="textbox">
              <input
                name="textbox"
                ref={this.emailRef}
                type="text"
                placeholder="Email"
                value={signInEmail}
                onChange={this.onTextboxChangeSignInEmail}
              ></input>
            </div>

            <div className="textbox">
              <input
                name="textbox"
                ref={this.passRef}
                type="password"
                placeholder="Password"
                value={signInPassword}
                onChange={this.onTextboxChangeSignInPassword}
              ></input>
            </div>

            {/* <button onClick={this.onSignIn} type="submit">Sign in</button>  */}
            <input
              onClick={this.onSignIn}
              class="btn"
              type="submit"
              value="Sign in"
            ></input>

            <h4>Not Registered?</h4>
            <Link style={navStyle} to="/register">
              <h4>Sign up</h4>
            </Link>

            {/* //        <TextField
      //           hintText="Enter Your Email"
      //           floatingLabelText="Email"
      //           // onChange={this.onChange}
      //           ref={this.emailRef}
      //           // onChange={handleChange("email")}
      //           // defaultValue={this.emailRef}
      //         />
      //         <TextField
      //           hintText="Enter Password"
      //           floatingLabelText="Password"
      //           ref={this.passRef}
      //           type="password"
      //         />
      //         <br />
      //         <RaisedButton
      //           label="Login"
      //           primary={true}
      //           style={styles.button}
      //           type="submit"
      //         />
      //         <h4>Not Registered?</h4>
      //         <Link style={navStyle} to="/register">
      //           <h4>Sign up</h4>
      //         </Link> */}
          </form>

          {/* </div> */}
        </React.Fragment>
        // </MuiThemeProvider>
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