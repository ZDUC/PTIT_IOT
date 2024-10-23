import React from 'react'
import {Container, Nav, Navbar, Offcanvas, Row, Image } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import LOGO from '../../assets/images/logo.png';

const Header = () => {

  const [open, setOpen] = React.useState<boolean>(false);

  const toggleMenu = () => {
    setOpen(!open)
  }

  return (
    <section className='header-section'>
      <Container className='fluid'>
        <Row>
          <Navbar expand="lg" className="bg-white mb-3">
            {/* Logo */}
            <Navbar.Brand className='ms-3 ms-md-0'>
              <NavLink to="/">
                <Image src={LOGO} alt="Logo" height={100} width={100} />

              </NavLink>
            </Navbar.Brand>
            {/* End logo */}

            {/* <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} /> */}
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-lg`}
              aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
              placement="start"
              show={open}
            >
              {/* mobile logo */}
              <Offcanvas.Header>
                <h1 className='logo'>
                  IOT
                </h1>
                <span className='navbar-toggler' onClick={toggleMenu}>
                  <i className='bi bi-x-lg'></i>
                </span>
              </Offcanvas.Header>
              {/* end mobile logo */}


              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link className='nav-link' href="./">HOME</Nav.Link>
                  <Nav.Link className='nav-link' href="./data-sensor">DATA SENSOR</Nav.Link>
                  <Nav.Link className='nav-link' href="./device">DEVICE</Nav.Link>
                  <Nav.Link className='nav-link' href="./profile">PROFILE</Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
            <div className='me-3 me-md-0'>
              <li className='d-inline-block d-lg-none ms-3 toggle_btn'>
                <i className='bi bi-list' onClick={toggleMenu}></i>
              </li>
            </div>
          </Navbar>
        </Row>
      </Container>
    </section>
  )
}
export default Header;