import {
  faSignOutAlt,
  faHdd,
  faCommentDots,
  faUpload,
  faPlus,
  faUserPlus,
  faCartPlus,
} from '@fortawesome/free-solid-svg-icons';
import SplitPane from 'react-split-pane';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect } from 'react';
import { Link, Route, useHistory } from 'react-router-dom';
import logo from '../../images/logos/logo.png';
import Order from '../Order/Order';
import './DashBoard.css';
import ServiceList from '../ServiceList/ServiceList';
import CreateReview from '../CreateReview/CreateReview';
import ServicesList from '../ServicesList/ServicesList';
import ServiceAdd from '../ServiceAdd/ServiceAdd';
import MakeAdmin from '../MakeAdmin/MakeAdmin';
import { UserContext } from '../../App';

const DashBoard = () => {
  const { LoggedInUser, SetLoggedInUser } = useContext(UserContext);

  useEffect(() => {
    fetch(
      `https://creative-agency-backend.herokuapp.com/getAdmin?email=${LoggedInUser.email}`
    )
      .then(res => res.json())
      .then(data => {
        // console.log(data);
        if (data) {
          const newUser = { ...LoggedInUser };
          newUser.setUser = true;
          SetLoggedInUser(newUser);
        } else {
          const newUser = { ...LoggedInUser };
          newUser.setUser = false;
          SetLoggedInUser(newUser);
        }
      });
  }, []);

  /////////// add to database ////////

  // just change the params to add all different types of fake data into database by this function

  const handleAddDatabase = () => {
    // fetch("https://creative-agency-backend.herokuapp.com/addServices", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(fakeServices),
    // })
    //   .then(result => result.json())
    //   .then(data => {
    //     console.log(data);
    //   });
  };
  let history = useHistory();
  const logoutHandle = () => {
    SetLoggedInUser('');
    history.push('/');
  };

  return (
    <div className='row dashboard'>
      <SplitPane split='vertical'>
        <div className='col-2 dashboardOptions d-flex flex-column justify-content-between'>
          <div className=''>
            <Link to='/'>
              <img className='dashLogo' src={logo} alt='' />
            </Link>
            <div className='dashboardLink d-flex flex-column'>
              {LoggedInUser.setUser ? (
                <div className='d-flex flex-column'>
                  <Link to='/dashboard/servicesList'>
                    <FontAwesomeIcon icon={faHdd} /> Services List
                  </Link>
                  <Link to='/dashboard/serviceAdd'>
                    <FontAwesomeIcon icon={faPlus} /> Add Services
                  </Link>
                  <Link to='/dashboard/makeAdmin'>
                    <FontAwesomeIcon icon={faUserPlus} /> Make Admin
                  </Link>
                  <p onClick={handleAddDatabase}>
                    <FontAwesomeIcon icon={faUpload} /> Add To Database
                  </p>
                </div>
              ) : (
                <div className='d-flex flex-column'>
                  <Link to='/dashboard/order'>
                    <FontAwesomeIcon icon={faCartPlus} /> Order
                  </Link>
                  <Link to='/dashboard/service-list'>
                    <FontAwesomeIcon icon={faHdd} /> Service List
                  </Link>
                  <Link to='/dashboard/create-review'>
                    <FontAwesomeIcon icon={faCommentDots} /> Reviews
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className='mt-auto'>
            <p onClick={logoutHandle}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </p>
          </div>
        </div>

        <div className='col-10 dashboardRight pt-5'>
          <div className='pageNameandUser d-flex justify-content-between px-5'>
            <h6>{!LoggedInUser.setUser ? 'Order' : 'Admin Panel'}</h6>
            {<p>{LoggedInUser.displayName} </p>}
          </div>
          <div className='dashboardDetails'>
            <div className='componentList' style={{ padding: '3rem' }}>
              <Route path='/dashboard/order' component={Order} />
              <Route path='/dashboard/service-list' component={ServiceList} />
              <Route path='/dashboard/servicesList' component={ServicesList} />
              <Route path='/dashboard/serviceAdd' component={ServiceAdd} />
              <Route path='/dashboard/create-review' component={CreateReview} />
              <Route path='/dashboard/makeAdmin' component={MakeAdmin} />
            </div>
          </div>
        </div>
      </SplitPane>
    </div>
  );
};

export default DashBoard;
