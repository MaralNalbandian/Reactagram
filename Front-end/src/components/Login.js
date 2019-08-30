import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import Nav from "./Nav";
import { Link } from "react-router-dom";

import { ImageGradient } from "material-ui/svg-icons";

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // username: "",
      // password: ""
      isLoading: true,
      token: "", //token means they're signed in
      signUpError: "",
      signInError: ""
    };
  }
  // getUser() {
  //   fetch("http://localhost:3000/api/auth")
  //     .then(response => response.json())
  //     .then(responseJson => {
  //       this.setState({ posts: responseJson });
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // }

  // componentWillMount() {
  //   this.getUser();
  // }
  // componentDidMount() {
  //   const token = getFromStorage("the_main_app");
  //   if (token) {
  //     //Verify token
  //     fetch("http://localhost:3000/api/auth")
  //       .then(res => res.json())
  //       .then(json => {
  //         if (json.success) {
  //           this.setState({
  //             token,
  //             isLoading: false
  //           });
  //         } else {
  //           this.setState({
  //             isLoading: false
  //           });
  //         }
  //       });
  //   } else {
  //     this.setState({
  //       isLoading: false
  //     });
  //   }
  // }

  login() {
    console.log("Login function");
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state);
  }

  addUser = () => {};

  render() {
    // const { isLoading } = this.state;

    // if (isLoading) {
    //   return (
    //     <div>
    //       <p>Loading...</p>
    //     </div>
    //   );
    // }

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
