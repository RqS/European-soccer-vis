import React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Button, ButtonGroup, ButtonDropdown } from 'reactstrap';
import { DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

var scrollToElement = require('scroll-to-element');

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
            <img src='../../img/logo.png' className="App-logo" alt="logo" style = {{"zoom":"0.35", "marginLeft":"-25px", "marginRight":"10px", "marginTop":"-10px"}}/>
              INF558-Project
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
            <NavItem>
            <ButtonGroup>
              <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.droptoggle}>
                <DropdownToggle color="link" caret style={{color: "black"}}>
                  Quick Explore
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={()=>{scrollToElement('#mapviewtitle', {offset: 50, duration: 1500});}}>Map Overview</DropdownItem>
                  <DropdownItem onClick={()=>{scrollToElement('#predictcharttitle', {offset: 50, duration: 1500});}}>Predict Model</DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
              <Button style={{color: "black"}} color="link" onClick={()=>{scrollToElement('#Team', {offset: 50, duration: 1500});}}>Team</Button>
              <Button style={{color: "black"}} color="link" href="https://github.com/INF554Fall17/project-ls-z">Github</Button>
            </ButtonGroup>
            </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}