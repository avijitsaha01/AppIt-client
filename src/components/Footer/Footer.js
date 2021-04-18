import React from 'react';
import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';
const Footer = () => {
  return (
    <footer style={{ background: '#20c997', padding: '4rem' }}>
      <div className='row footer'>
        <div className='col-md-6'>
          <div className='footerLeft'>
            <h2>Let us handle your project, professionally.</h2>
            <p>
              With well written codes, we build amazing apps for all platforms,
              mobile and web apps in general.
            </p>
          </div>
        </div>
        <div className='col-md-6 footerRight'>
          <Form>
            <Form.Group controlId='formBasicEmail'>
              <Form.Control type='email' placeholder='Enter Email Address' />
            </Form.Group>
            <Form.Group controlId='formBasicPassword'>
              <Form.Control type='text' placeholder='Your Name/Company Name' />
            </Form.Group>
            <Form.Group controlId='formBasicPassword'>
              <Form.Control as='textarea' placeholder='Your message' rows='6' />
            </Form.Group>
            <Link
              to=''
              className='submitContact'
              variant='primary'
              type='submit'>
              Send
            </Link>
          </Form>
        </div>
      </div>
      <p className='text-center m-0'>
        &copy; copyright Programming Hero under Assignment 11 {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;
