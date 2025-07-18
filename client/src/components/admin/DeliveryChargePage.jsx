// src/pages/DeliveryChargePage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDeliveryCharges,
  createDeliveryCharge,
} from '../../features/deliveryChargeSlice';
import { Form, Button, Table, Container, Alert } from 'react-bootstrap';

const DeliveryChargePage = () => {
  const [colony, setColony] = useState('');
  const [charge, setCharge] = useState('');

  const dispatch = useDispatch();
  const { charges, loading, error } = useSelector((state) => state.deliveryCharge);
  const { userInfo } = useSelector((state) => state.auth); // assuming JWT is here
console.log(charges);
  useEffect(() => {
    dispatch(fetchDeliveryCharges());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!colony || !charge) return;
    dispatch(
      createDeliveryCharge({
        colony,
        charge,
       
      })
    );
    setColony('');
    setCharge('');
  };

  return (
    <Container className="py-4">
      <h2>Delivery Charges</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group className="mb-2">
          <Form.Label>Colony Name</Form.Label>
          <Form.Control
            type="text"
            value={colony}
            onChange={(e) => setColony(e.target.value)}
            placeholder="Enter colony name"
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Charge (in ₹)</Form.Label>
          <Form.Control
            type="number"
            value={charge}
            onChange={(e) => setCharge(e.target.value)}
            placeholder="Enter charge"
          />
        </Form.Group>

        <Button type="submit">Add Charge</Button>
      </Form>

      <h4>Existing Charges</h4>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Colony</th>
              <th>Charge (₹)</th>
            </tr>
          </thead>
          <tbody>
            {(charges || []).map((c, index) => (
              <tr key={c._id || index}>
                <td>{index + 1}</td>
                <td>{c.colony}</td>
                <td>₹{c.charge}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default DeliveryChargePage;
