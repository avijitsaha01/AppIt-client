import React, { useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import './MakeAdmin.css';
const MakeAdmin = () => {
  const [newAdmin, SetNewAdmin] = useState({
    email: '',
    success: '',
    error: '',
  });

  const inputHandler = e => {
    e.preventDefault();
    const admin = { ...newAdmin };
    admin[e.target.name] = e.target.value;
    SetNewAdmin(admin);
  };
  // ////////////////////////////
  const formRef = useRef(null);

  const handleReviewSubmit = event => {
    event.preventDefault();
    fetch('https://creative-agency-backend.herokuapp.com/addAdmin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAdmin),
    })
      .then(result => {
        const updateAdmin = { ...newAdmin };
        updateAdmin.success = 'Set Admin Successfully';
        updateAdmin.error = '';
        SetNewAdmin(updateAdmin);
        result.json();
      })
      .then(data => {
        // console.log(data);
      })
      .catch(err => {
        const errUpdate = { ...newAdmin };
        errUpdate.success = '';
        errUpdate.error = 'something wrong happened';
        SetNewAdmin(errUpdate);
      });
    formRef.current.reset();
  };
  return (
    <div className='adminMakeForm'>
      {newAdmin.success && <p className='text-success'>{newAdmin.success}</p>}
      {newAdmin.error && <p className='text-danger'>{newAdmin.error}</p>}
      <Form onSubmit={handleReviewSubmit} ref={formRef}>
        <div className='addAdminBody d-flex justify-content-around align-items-center'>
          <Form.Group controlId='formBasicText' className='titleInput'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              name='email'
              type='text'
              onBlur={inputHandler}
              placeholder='test@gmail.com'
            />
          </Form.Group>
          <div className='buttonDiv'>
            <button className='makeAdmin' variant='primary' type='submit'>
              Send
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default MakeAdmin;
