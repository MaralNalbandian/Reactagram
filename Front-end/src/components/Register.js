//Register component - The register component is the registration page of the application
//where the user can register and create and account.
//Displays input fields for name, email and password as well as a sign up button
//once required fields are complete
//Author(s) - Maral and Brendon
//Date - 19/10/19
import React from "react";
import validateUserIdToken from './utils/validateToken'

export class Register extends React.Component {
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
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
    this.onTextboxChangeSignUpName = this.onTextboxChangeSignUpName.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);

    this.onSignUp = this.onSignUp.bind(this);
  }

  // Author(s) - Maral
  // Date - 19/09/19
  // Description - Once user succesfully registered grab token and set loading to false
  // Return - N/A
  async componentDidMount() {
    if (await validateUserIdToken()) {
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
    }
  }

  // Author(s) - Maral
  // Date - 19/09/19
  // Description - The logout function logs the user out by clearing token
  //from local storage and telling backend to "delete" the specific user session
  //User is logged out
  // Return - N/A
  logout() {
    localStorage.clear();
    try {
      this.setState({ token: "" })
    }
    catch (error) {
      console.error(error);
    }
  }

  // Author(s) - Maral
  // Date - 18/09/19
  // Function - onTextboxChangeSignUpEmail
  // Description - Handle when text is updated in the email text field
  // Parameters - event: information about what and how this is changing. e.g. event.target.value
  // Return - N/A
  onTextboxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value
    });
    if (event.target.value.length === 250) {
      this.setState({ signUpError: "Error: Email must be 250 characters or less" })
    } else {
      this.setState({ signUpError: "" })
    }
  }

  // Author(s) - Maral
  // Date - 18/09/19
  // Function - onTextboxChangeSignUpPassword
  // Description - Same as above: for password field.
  // Parameters - event: information about what and how this is changing.
  // Return - N/A
  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value
    });
    if (event.target.value.length === 250) {
      this.setState({ signUpError: "Error: Password must be 250 characters or less" })
    } else {
      this.setState({ signUpError: "" })
    }
  }

  // Author(s) - Maral
  // Date - 18/09/19
  // Function - onTextboxChangeSignUpName
  // Description - Same as above: for username field.
  // Parameters - event: information about what and how this is changing.
  // Return - N/A
  onTextboxChangeSignUpName(event) {
    this.setState({
      signUpName: event.target.value
    });
    if (event.target.value.length === 250) {
      this.setState({ signUpError: "Error: Name must be 250 characters or less" })
    } else {
      this.setState({ signUpError: "" })
    }
  }

  // Author(s) - Maral
  // Date - 19/09/19
  // Description - The sign up function grabs the values stored in state and creates an API request to register
  // User is registered and is able to login
  // Return - N/A
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

  // Redirect to the login screen when the login button is clicked
  onLogin() {
    window.location.assign("/login")
  }

  nameRef = React.createRef();
  passRef = React.createRef();
  emailRef = React.createRef();

  state = {};

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
        <div>
          <p>Loading...</p>
        </div>
      );
    }

    if (signUpError === "Signed up") {
      return (
        <React.Fragment>
          <p>{signUpError}</p>
          <button onClick={this.onLogin}>Login</button>
        </React.Fragment>
      )
    }

    if (token === "") {
      return (
        <React.Fragment>
          <div>
            <div>
              {signUpError ? <p>{signUpError}</p> : null}
              <p>Sign Up</p>
              <input
                type="text"
                placeholder="Name"
                value={signUpName}
                onChange={this.onTextboxChangeSignUpName}
              />
              <br />
              <input
                type="email"
                placeholder="Email"
                value={signUpEmail}
                onChange={this.onTextboxChangeSignUpEmail}
              />
              <br />
              <input
                type="password"
                placeholder="Password"
                value={signUpPassword}
                onChange={this.onTextboxChangeSignUpPassword}
              />
              <br />
              <button onClick={this.onSignUp}>Sign Up</button>
            </div>
          </div>
        </React.Fragment>
      );
    }

    //If user is already logged in
    return (
      <React.Fragment>
        {/* Loads a page with a logout button if user already logged in */}
        <p>Account - go to login screen to sign out</p>
        <button onClick={this.onLogin}>Login</button>
      </React.Fragment>
    );
  }
}

export default Register;
