import React from 'react';

import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';

class Menu extends React.Component {  
    constructor() {
        super()
        this.state ={}
    }

    render() {
        return (
            <div>
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/"><img id="Leaderboard" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Topeka-leaderboard.svg/480px-Topeka-leaderboard.svg.png" alt="Leaderboard"></img></NavbarBrand>
                    <Nav className="ml-auto" navbar><h1>Reactagram</h1></Nav>
                    <Nav className="ml-auto" navbar>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                            <img id="userImage" src="https://image.flaticon.com/icons/png/512/149/149071.png" alt="User"></img>
                            </DropdownToggle>   
                            <DropdownMenu right>
                            <DropdownItem>
                                Login
                            </DropdownItem>
                            <DropdownItem>
                                Sign Up
                            </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                </Navbar>
            </div>
        )
    }
}

export default Menu;