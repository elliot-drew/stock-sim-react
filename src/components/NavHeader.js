import React from 'react';
import {Nav, Navbar, Container} from 'react-bootstrap'

export default class NavHeader extends React.Component {

	constructor(props) {
		super(props);
		
	}

	render() {
		return (
			<div>
			  <Navbar bg="dark" variant="dark">
			    <Container>
			    <Navbar.Brand href="#home">{ this.props.name }</Navbar.Brand>
			    <Nav className="me-auto">
			      {/*<Nav.Link href="#home">Help</Nav.Link>*/}

			      <Nav.Link target="_blank" href="https://elliot-drew.github.io/portfolio/">Portfolio</Nav.Link>
			      <Nav.Link target="_blank" href="https://github.com/elliot-drew">Github</Nav.Link>
			      <Nav.Link target="_blank" href="https://www.linkedin.com/in/elliot-drew-bio/">LinkedIn</Nav.Link>
			    </Nav>
			    </Container>
			  </Navbar>
			</div>
		);
	}
}

