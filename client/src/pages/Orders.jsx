import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Table, Badge } from 'react-bootstrap';
import { fetchMyOrders} from '../features/orderSlice';

const Orders = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myOrders, loading, error } = useSelector((state) => state.orders); // ✅ fixed line
  console.log(myOrders);
  useEffect(() => {
    if (user) dispatch(fetchMyOrders());
  }, [dispatch, user]);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">My Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Products</th>
              <th>Total</th>
              <th>Delivery</th>
              <th>Status</th>
              <th>Address</th>
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
                  <Badge bg={
                    order.status === 'pending' ? 'warning'
                    : order.status === 'delivered' ? 'success'
                    : 'danger'}>
                    {order.status}
                  </Badge>
                </td>
                <td>{order.address}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Orders;
