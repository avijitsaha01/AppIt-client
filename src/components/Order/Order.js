import React, { useContext, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { UserContext } from '../../App';
import './Order.css';

const Order = () => {
  const { LoggedInUser, SetLoggedInUser } = useContext(UserContext);
  const { selectedService, SetSelectedService } = useContext(UserContext);

  const [newOrder, SetNewOrder] = useState({
    img: `${selectedService.img}`,
    company_name: `${LoggedInUser.displayName}`,
    name: `${selectedService.name}`,
    details: '',
    price: `${selectedService.price}`,
    email: `${LoggedInUser.email}`,
    success: '',
    status: 'pending',
    error: '',
  });

  const inputHandler = e => {
    e.preventDefault();
    const order = { ...newOrder };
    order[e.target.name] = e.target.value;
    SetNewOrder(order);
  };
  //////////////////////////////////
  const formRef = useRef(null);
  const [file, setFile] = useState(null);
  const handleFileChange = e => {
    const newFile = e.target.files[0];
    setFile(newFile);
  };
  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('img', newOrder.img);
    formData.append('name', newOrder.name);
    formData.append('email', newOrder.email);
    formData.append('price', newOrder.price);
    formData.append('company_name', newOrder.company_name);
    formData.append('details', newOrder.details);
    formData.append('status', newOrder.status);

    fetch('https://creative-agency-backend.herokuapp.com/addNewOrder', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        response.json();
        const orderInfo = { ...newOrder };
        orderInfo.error = '';
        orderInfo.success = 'Order Placed Successfully';
        SetNewOrder(orderInfo);
      })
      .then(data => {
        // console.log(data);
      })
      .catch(error => {
        console.error(error);
        const updateOrderInfo = { ...newOrder };
        updateOrderInfo.error = 'Something wrong happened';
        updateOrderInfo.success = '';
        SetNewOrder(updateOrderInfo);
      });
    formRef.current.reset();
  };

  // ////////////////////////////

  return (
    <div className='orderForm'>
      {!newOrder.success && (
        <p style={{ color: 'red' }}>
          <small>you must fill up all field include picture</small>
        </p>
      )}
      {newOrder.success && <p className='text-success'>{newOrder.success}</p>}
      {newOrder.error && <p className='text-danger'>{newOrder.error}</p>}
      <Form onSubmit={handleSubmit} ref={formRef}>
        <Form.Group controlId='formBasicText'>
          <Form.Control
            onBlur={inputHandler}
            type='text'
            defaultValue={LoggedInUser.displayName}
            name='company_name'
            placeholder='Your Name/Company Name'
            readOnly
          />
        </Form.Group>
        <Form.Group controlId='formBasicEmail'>
          <Form.Control
            type='email'
            defaultValue={LoggedInUser.email}
            placeholder='Enter Email Address'
            readOnly
          />
        </Form.Group>
        <Form.Group controlId='formBasicText'>
          <Form.Control
            type='text'
            defaultValue={selectedService.name}
            placeholder='Enter A Service'
            readOnly
          />
        </Form.Group>
        <Form.Group controlId='formBasicPassword'>
          <Form.Control
            as='textarea'
            name='details'
            onBlur={inputHandler}
            placeholder='Project Details'
            rows='4'
          />
        </Form.Group>
        <div className='fff d-flex justify-content-between  mb-3'>
          <Form.Group controlId='formBasicText' className='m-0'>
            <Form.Control
              type='text'
              defaultValue={selectedService.price}
              placeholder='Price'
              readOnly
            />
          </Form.Group>
          <input
            onChange={handleFileChange}
            type='file'
            className='form-control'
            id='exampleInputPassword1'
            placeholder='Picture'
          />
        </div>
        <button className='submitContact' variant='primary' type='submit'>
          Send
        </button>
      </Form>
    </div>
  );
};

export default Order;
