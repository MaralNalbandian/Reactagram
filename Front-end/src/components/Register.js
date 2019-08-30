import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import Login from "./Login";
import Nav from "./Nav";

export class Register extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <React.Fragment>
          <Nav />
          <TextField
            hintText="Enter Your First Name"
            floatingLabelText="First Name"
            // onChange={handleChange("firstName")}
            // defaultValue={values.firstName}
          />
          <br />
          <TextField
            hintText="Enter Your Last Name"
            floatingLabelText="Last Name"
            // onChange={handleChange("lastName")}
            // defaultValue={values.lastName}
          />
          <br />
          <TextField
            hintText="Enter Password"
            floatingLabelText="Password"
            onChange={this.onChange}
            // onChange={handleChange("password")}
            // defaultValue={values.password}
          />
          <br />
          <TextField
            hintText="Enter Your Email"
            floatingLabelText="Email"
            // onChange={handleChange("email")}
            // defaultValue={values.email}
          />
          <br />
          <RaisedButton
            label="Register"
            primary={true}
            style={navstyles.button}
            onClick={this.continue}
          />
        </React.Fragment>
      </MuiThemeProvider>
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
