import React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, Button } from 'reactstrap';
import logo from '../img/logo.png';


export default class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <Navbar color="faded" light expand="md" style = {{"padding": "0.2rem 1rem"}}>
          <NavbarBrand href="/">
            <img src={logo} className="App-logo" alt="logo" style = {{"zoom":"0.35", "marginLeft":"-25px", "marginRight":"10px", "marginTop":"-10px"}}/>
              INF558-Project
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="https://github.com/INF554Fall17/project-ls-z"><Button style = {{"zoom":"0.8"}} color="secondary" size="lg" block>Github</Button></NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}