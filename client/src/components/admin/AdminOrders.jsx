import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllOrders,
  updateOrderStatus,
  deleteOrderById,
} from '../../features/orderSlice';
import {
  Table,
  Form,
  Badge,
  Container,
  Row,
  Col,
  Button,
  InputGroup,
} from 'react-bootstrap';
import { FaSearch, FaTrash } from 'react-icons/fa';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    if (!orderId) return;
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      dispatch(deleteOrderById(orderId));
    }
  };

  // 🔍 Filtered + Searched Orders
  const filteredOrders = orders
    .filter((order) =>
      statusFilter === 'all' ? true : order.status === statusFilter
    )
    .filter(
      (order) =>
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Container className="mt-4">
      <h4 className="mb-4">📦 Admin Panel - All Orders</h4>

      {/* 🔎 Search & Filter */}
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by user or address"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </Col>
      </Row>

      {/* 📋 Table */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Products</th>
              <th>Total</th>
              <th>Delivery</th>
              <th>Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, idx) => (
              <tr key={order._id}>
                <td>{idx + 1}</td>
                <td>{order.user?.name || 'N/A'}</td>
                <td>
                  <ul className="mb-0">
                    {order.products.map((p, i) => (
                      <li key={i}>
                        {p.name} × {p.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>₹{order.totalAmount}</td>
                <td>₹{order.deliveryCharge}</td>
                <td>{order.address}</td>
                <td>
                  <Form.Select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    size="sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>

                  <Badge
                    bg={
                      order.status === 'pending'
                        ? 'warning'
                        : order.status === 'delivered'
                        ? 'success'
                        : 'danger'
                    }
                    className="mt-1"
                  >
                    {order.status}
                  </Badge>
                </td>
                <td className="text-center">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteOrder(order._id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminOrders;
