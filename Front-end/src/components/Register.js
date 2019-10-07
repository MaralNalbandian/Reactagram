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

  async componentDidMount() {
    if (await validateUserIdToken()){
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

  logout() {
    localStorage.clear();
    this.setState({token: ""})
  }

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

  onLogin(){
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

    if (signUpError === "Signed up"){
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

    return (
      <React.Fragment>
          <p>Account</p>
          <button onClick={this.logout}>Logout</button>
      </React.Fragment>
    );
  }
}

export default Register;
