import React from "react";

import {
  Navbar,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { link } from "fs";
import Login from "./Login";

class Menu extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <>
        {/* https://reactstrap.github.io/components/navbar/ */}
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">
            <img
              id="Leaderboard"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Topeka-leaderboard.svg/480px-Topeka-leaderboard.svg.png"
              alt="Leaderboard"
            ></img>
          </NavbarBrand>
          <Nav className="ml-auto" navbar>
            <h1>Reactagram</h1>
          </Nav>
          <Nav className="ml-auto" navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                <img
                  id="userImage"
                  src="https://image.flaticon.com/icons/png/512/149/149071.png"
                  alt="User"
                ></img>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem href="/login">Login</DropdownItem>
                <DropdownItem href="/register">Sign Up</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Navbar>
      </>
    );
  }
}

export default Menu;
