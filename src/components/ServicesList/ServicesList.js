import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import SingleServiceList from "../SingleServiceList/SingleServiceList";
const ServicesList = () => {
  const [listOfServices, SetListOfServices] = useState([]);

  useEffect(() => {
    fetch("https://creative-agency-backend.herokuapp.com/getAllOrder")
      .then(res => res.json())
      .then(getlistOfServices => SetListOfServices(getlistOfServices));
  }, []);

  return (
    <div className='serviceListTable' style={{ backgroundColor: "white" }}>
      <Table responsive='lg' borderless>
        <thead className='tableHead'>
          <tr>
            <th>Name</th>
            <th>Email ID</th>
            <th>Service </th>
            <th>Project Details</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {listOfServices.map(services => (
            <SingleServiceList key={services._id} services={services} />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ServicesList;
