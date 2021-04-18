import React, { useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import './ServiceAdd.css';

const ServiceAdd = () => {
  const [newService, SetNewService] = useState({
    name: '',
    details: '',
    price: '',
    success: '',
    error: '',
  });

  const inputHandler = e => {
    e.preventDefault();
    const service = { ...newService };
    service[e.target.name] = e.target.value;
    SetNewService(service);
  };
  //////////////////////////////////
  const formRef = useRef(null);
  const [serviceFile, setServiceFile] = useState(null);
  const handleFileChange = e => {
    const newFile = e.target.files[0];
    setServiceFile(newFile);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('file', serviceFile);
    formData.append('name', newService.name);
    formData.append('price', newService.price);
    formData.append('details', newService.details);

    fetch('https://creative-agency-backend.herokuapp.com/addNewService', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        response.json();
        const serviceInfo = { ...newService };
        serviceInfo.error = '';
        serviceInfo.success = 'Service Add Successfully';
        SetNewService(serviceInfo);
      })
      .then(data => {
        // console.log(data);
      })
      .catch(error => {
        const updateServiceInfo = { ...newService };
        updateServiceInfo.error = 'Something wrong happened';
        updateServiceInfo.success = '';
        SetNewService(updateServiceInfo);
      });
    formRef.current.reset();
  };

  // ////////////////////////////
  return (
    <div className='serviceAddForm'>
      {!newService.success && (
        <p style={{ color: 'red' }}>
          <small>you must fill up all field include picture</small>
        </p>
      )}
      {newService.success && (
        <p className='text-success'>{newService.success}</p>
      )}
      {newService.error && <p className='text-danger'>{newService.error}</p>}
      <Form onSubmit={handleSubmit} ref={formRef}>
        <div className='addServiceBody'>
          <div className='fff d-flex justify-content-between  mb-3'>
            <Form.Group controlId='formBasicText' className='mr-3 titleInput'>
              <Form.Label>Service Title</Form.Label>
              <Form.Control
                onBlur={inputHandler}
                className='textInput'
                type='text'
                name='name'
                placeholder='Enter title'
              />
            </Form.Group>
            <div className='fileInputDiv'>
              <input
                onChange={handleFileChange}
                type='file'
                className='form-control fileInput'
                id='exampleInputPassword1'
                placeholder='Picture'
              />
            </div>
          </div>
          <div className='fff d-flex justify-content-between  mb-3'>
            <Form.Group controlId='formBasicText'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                onBlur={inputHandler}
                as='textarea'
                name='details'
                placeholder='Description'
                rows='4'
              />
            </Form.Group>
            <Form.Group controlId='formBasicText' className='mr-3 titleInput'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                onBlur={inputHandler}
                type='number'
                name='price'
                className='textInput'
                placeholder='Enter price'
              />
            </Form.Group>
          </div>
        </div>
        <button className='addService' variant='primary' type='submit'>
          Send
        </button>
      </Form>
    </div>
  );
};

export default ServiceAdd;
