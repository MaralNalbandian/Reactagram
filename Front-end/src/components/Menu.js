import React from 'react';

import {Navbar, NavbarBrand, Nav, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class Menu extends React.Component {  
    state = {}

    render() {
        return (
            <>
                {/* https://reactstrap.github.io/components/navbar/ */}
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/leaderboard"><img id="Leaderboard" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Topeka-leaderboard.svg/480px-Topeka-leaderboard.svg.png" alt="Leaderboard"></img></NavbarBrand>
                    <NavbarBrand href="/" className="ml-auto"><h1>Reactagram</h1></NavbarBrand>
                    <Nav className="ml-auto" navbar>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                            <img id="userImage" src="https://image.flaticon.com/icons/png/512/149/149071.png" alt="User"></img>
                            </DropdownToggle>   
                            <DropdownMenu right>
                            <DropdownItem href="/login">
                                Login
                            </DropdownItem>
                            <DropdownItem href="/register">
                                Sign Up
                            </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                </Navbar>
            </>
        )
    }
}

export default Menu;