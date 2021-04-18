import React, { useContext } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';
import logo from '../../images/logo.png';
import './Header.css';
const Header = () => {
  const { LoggedInUser, SetLoggedInUser } = useContext(UserContext);

  const logoutButtonHandler = () => {
    SetLoggedInUser('');
  };
  return (
    <header className='container'>
      <Navbar expand='lg'>
        <Navbar.Brand>
          <Link to='/'>
            <img src={logo} className='logoImg' alt='' />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav '>
          <Nav className='ml-auto justify-content-center align-items-center'>
            <Link className='active' to='/'>
              Home
            </Link>
            <Link to='/'>Our Portfolio</Link>
            <Link to='/'>Our Team</Link>
            <Link to='/'>Contact Us</Link>
            {LoggedInUser.email && (
              <Link to='/dashboard' className='loginBtn'>
                Admin
              </Link>
            )}
            {!LoggedInUser.email ? (
              <Link to='/login' className='loginBtn'>
                Login
              </Link>
            ) : (
              <button className='logout' onClick={logoutButtonHandler}>
                Logout
              </button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};

export default Header;
