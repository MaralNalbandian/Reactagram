import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import Login from "./Login";
import Nav from "./Nav";
import axios from 'axios';

export class Register extends React.Component {
  fnameRef = React.createRef();
  lnameRef = React.createRef();
  passRef = React.createRef();
  emailRef = React.createRef();

  state = {};

  checkUser = event => {
    event.preventDefault();

    axios("http://localhost:80/api/user/register", {
      method: "post",
      body: {
        name: this.fnameRef.current.value,
        lastname: this.lnameRef.current.value,
        email: this.emailRef.current.value,
        password: this.passRef.current.value
      }
    })
    .then(response => {
        console.log(response)
        this.setState({ name: response.data.name });
        this.setState({ lastname: response.data.lastname });
        this.setState({ email: response.data.email });
        this.setState({ password: response.data.password });
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    return (
      // <MuiThemeProvider>
      <React.Fragment>
        <Nav />
        {/* <TextField
          hintText="Enter Your First Name"
          floatingLabelText="First Name"
          ref={this.fnameRef}
          // onChange={handleChange("firstName")}
          // defaultValue={values.firstName}
        />
        <br />
        <TextField
          hintText="Enter Your Last Name"
          floatingLabelText="Last Name"
          ref={this.lnameRef}
          // onChange={handleChange("lastName")}
          // defaultValue={values.lastName}
        />
        <br />
        <TextField
          hintText="Enter Password"
          floatingLabelText="Password"
          ref={this.passRef}
          onChange={this.onChange}
          // onChange={handleChange("password")}
          // defaultValue={values.password}
        />
        <br />
        <TextField
          hintText="Enter Your Email"
          floatingLabelText="Email"
          ref={this.emailRef}
          // onChange={handleChange("email")}
          // defaultValue={values.email}
        />
        <br />
        <RaisedButton
          label="Register"
          primary={true}
          style={navstyles.button}
          onClick={this.checkUser}
        /> */}
      </React.Fragment>
      // </MuiThemeProvider>
    );
  }
}
const navStyle = {
  color: "white"
};
const navstyles = {
  button: {
    margin: 15
  }
};

export default Register;
