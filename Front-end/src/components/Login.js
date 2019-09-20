import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import Nav from "./Nav";
import axios from "axios";
import { Link } from "react-router-dom";

import { ImageGradient } from "material-ui/svg-icons";

export class Login extends React.Component {
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
    return (
      // <MuiThemeProvider>
      <React.Fragment>
        <Nav />

        {/* <div className="input"> */}
        <form className="check" onSubmit={this.checkUser}>
          <div>Email:</div>
          <input name="textbox" ref={this.emailRef} type="text"></input>
          <div>Password:</div>
          <input name="textbox" ref={this.passRef} type="password"></input>
          <button type="submit">Login</button>
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
