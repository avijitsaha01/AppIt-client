import React, { useContext } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link, useHistory, useLocation } from 'react-router-dom';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebase.config';
import { UserContext } from '../../App';
import './Login.css';
import icon from '../../images/icons/google.png';
import logo from '../../images/logos/logo.png';

firebase.initializeApp(firebaseConfig);

const Login = () => {
  const { LoggedInUser, SetLoggedInUser } = useContext(UserContext);
  const location = useLocation();
  const history = useHistory();
  let { from } = location.state || { from: { pathname: '/' } };

  /////// google sign in //////////////

  const googleSignInHandler = e => {
    e.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        SetLoggedInUser(result.user);
        history.replace(from);
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  /////// google sign end //////////////

  return (
    <div className='loginPage'>
      <Link to='/'>
        <img style={{ width: '10rem', margin: '0 auto' }} src={logo} alt='' />
      </Link>
      <Card style={{ width: '30rem' }} className='login'>
        <Card.Body className='d-flex flex-column justify-content-center align-items-center loginForm'>
          <h3>Login With</h3>
          <Button className="g-signin2" onClick={googleSignInHandler}>
            <img
              style={{ width: '1.5rem', marginRight: '1rem' }}
              src={icon}
              alt=''
            />
            Continue With Google
          </Button>
          <p>
            Don't have an account ? <Link to=''>Create an account</Link>{' '}
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
