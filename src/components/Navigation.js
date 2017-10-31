import React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Button, ButtonGroup, ButtonDropdown } from 'reactstrap';
import logo from '../img/logo.png';
import { DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';



export default class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.droptoggle = this.droptoggle.bind(this);
    this.state = {
      isOpen: false,
      dropdownOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  droptoggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    return (
      <div>
        <Navbar color="faded" light expand="md" style = {{"padding": "0.2rem 1rem"}}>
          <NavbarBrand href="#">
            <img src={logo} className="App-logo" alt="logo" style = {{"zoom":"0.35", "marginLeft":"-25px", "marginRight":"10px", "marginTop":"-10px"}}/>
              INF558-Project
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
            <NavItem>
            <ButtonGroup>
              <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.droptoggle}>
                <DropdownToggle caret>
                  Quick Explore
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header>Header</DropdownItem>
                  <DropdownItem disabled>Action</DropdownItem>
                  <DropdownItem>Another Action</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>Another Action</DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
              <Button href="#">Team</Button>
              <Button href="https://github.com/INF554Fall17/project-ls-z">Github</Button>
            </ButtonGroup>
            </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}