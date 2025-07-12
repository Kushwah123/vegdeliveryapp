import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Table, Badge } from 'react-bootstrap';
import { fetchMyOrders } from '../features/orderSlice';

const Orders = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myOrders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (user) dispatch(fetchMyOrders());
  }, [dispatch, user]);

  const renderStatusBadge = (status) => {
    const variant =
      status === 'pending'
        ? 'warning'
        : status === 'delivered'
        ? 'success'
        : 'danger';
    return <Badge bg={variant}>{status}</Badge>;
  };

  const renderPaymentBadge = (method, verified) => {
    if (method === 'COD') {
      return <Badge bg="secondary">Cash On Delivery</Badge>;
    }

    const verificationVariant =
      verified === 'verified'
        ? 'success'
        : verified === 'rejected'
        ? 'danger'
        : 'warning';

    return (
      <>
        <Badge bg="primary" className="me-1">Online</Badge>
        <Badge bg={verificationVariant}>
          {verified ? verified.toUpperCase() : 'PENDING'}
        </Badge>
      </>
    );
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">📦 My Orders</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : myOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Products</th>
              <th>Total</th>
              <th>Delivery</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Address</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {myOrders.map((order, idx) => (
              <tr key={order._id}>
                <td>{idx + 1}</td>
                <td>
                  <ul className="mb-0">
                    {order.products.map((p, i) => (
                      <li key={i}>{p.name} × {p.quantity}</li>
                    ))}
                  </ul>
                </td>
                <td>₹{order.totalAmount}</td>
                <td>₹{order.deliveryCharge}</td>
                <td>
                  {renderPaymentBadge(order.paymentMethod, order.paymentVerified)}
                </td>
                <td>{renderStatusBadge(order.status)}</td>
                <td>{order.address}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Orders;
