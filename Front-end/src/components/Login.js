import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import Nav from "./Nav";
import { Link } from "react-router-dom";

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };

    this.login = this.login.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  login() {
    console.log("Login function");
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state);
  }

  render() {
    return (
      <MuiThemeProvider>
        <React.Fragment>
          <Nav />

          <br />
          <TextField
            hintText="Enter Your Email"
            floatingLabelText="Email"
            onChange={this.onChange}
            // onChange={handleChange("email")}
            // defaultValue={values.email}
          />
          <TextField
            hintText="Enter Password"
            floatingLabelText="Password"
            onChange={this.onChange}
            // onChange={handleChange("password")}
            // defaultValue={values.password}
          />
          <br />
          <RaisedButton
            label="Login"
            primary={true}
            style={styles.button}
            onClick={this.login}
          />
          <h4>Not Registered?</h4>
          <Link style={navStyle} to="/register">
            <h4>Sign up</h4>
          </Link>
        </React.Fragment>
      </MuiThemeProvider>
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
