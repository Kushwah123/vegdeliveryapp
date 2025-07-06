import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllOrders,
  updateOrderStatus,
  deleteOrderById,
} from '../../features/orderSlice';
import { fetchAllUsers } from '../../features/authSlice';
import { fetchProducts } from '../../features/productSlice';

import {
  Table,
  Form,
  Badge,
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  Spinner,
  Alert,
  Modal,
} from 'react-bootstrap';
import {
  FaSearch,
  FaTrash,
  FaUser,
  FaBox,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaShieldAlt,
  FaFileInvoice,
  FaFileExport,
} from 'react-icons/fa';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const { users } = useSelector((state) => state.auth);
  const { products } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchAllUsers());
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  const openModal = (orderId) => {
    setDeleteId(orderId);
    setShowModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteOrderById(deleteId));
    setShowModal(false);
    setDeleteId(null);
  };

  const today = new Date().toDateString();
  const newUsersToday = users.filter(
    (u) => new Date(u.createdAt).toDateString() === today
  );

  const lowStock = products.filter((p) => p.stock < 5);

  const filteredOrders = orders.orders
    .filter((order) =>
      statusFilter === 'all' ? true : order.status === statusFilter
    )
    .filter(
      (order) =>
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // 📄 Export all orders to PDF
  const handleExportAllPDF = () => {
    const doc = new jsPDF();
    doc.text('All Orders Report', 14, 10);

    const rows = filteredOrders.map((order, idx) => [
      idx + 1,
      order.user?.name || 'N/A',
      order.products.map((p) => `${p.name} × ${p.quantity}`).join(', '),
      `₹${order.totalAmount}`,
      `₹${order.deliveryCharge}`,
      order.status,
      order.address,
    ]);

    doc.autoTable({
      head: [['#', 'User', 'Products', 'Total', 'Delivery', 'Status', 'Address']],
      body: rows,
      startY: 15,
    });

    doc.save('all_orders.pdf');
  };

  // 🧾 Export individual invoice
  const handleDownloadInvoice = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Invoice - Order ID: ${order._id}`, 14, 10);
    doc.setFontSize(11);
    doc.text(`User: ${order.user?.name || 'N/A'}`, 14, 20);
    doc.text(`Address: ${order.address}`, 14, 30);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 40);

    const productsData = order.products.map((p, i) => [
      i + 1,
      p.name,
      p.quantity,
      p.price || 'N/A',
      p.price ? `₹${p.price * p.quantity}` : '—',
    ]);

    doc.autoTable({
      startY: 50,
      head: [['#', 'Product', 'Qty', 'Price', 'Total']],
      body: productsData,
    });

    const finalY = doc.lastAutoTable.finalY || 70;
    doc.text(`Total Amount: ₹${order.totalAmount}`, 14, finalY + 10);
    doc.text(`Delivery Charge: ₹${order.deliveryCharge}`, 14, finalY + 20);
    doc.text('GST (0%): ₹0', 14, finalY + 30); // optional
    doc.save(`invoice_${order._id}.pdf`);
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-3 text-success">📦 Manage All Orders</h3>

      {/* 🔔 Alerts */}
      <div className="mb-4">
        {newUsersToday.length > 0 && (
          <Alert variant="info" className="d-flex align-items-center gap-2">
            <FaUser /> <strong>{newUsersToday.length}</strong> new user(s) today!
          </Alert>
        )}

        {lowStock.length > 0 && (
          <Alert variant="warning" className="d-flex align-items-center gap-2">
            <FaBox /> <strong>{lowStock.length}</strong> product(s) are low in stock!
          </Alert>
        )}

        <Alert variant="dark" className="d-flex align-items-center gap-2">
          <FaShieldAlt className="text-success" />
          Secure Admin Access: Authorized personnel only.
        </Alert>
      </div>

      {/* 🔍 Filters */}
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by user name or address"
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
        <Col md={3} className="mt-2 mt-md-0">
          <Button variant="outline-success" onClick={handleExportAllPDF}>
            <FaFileExport className="me-2" />
            Export All Orders
          </Button>
        </Col>
      </Row>

      {/* 🧾 Table */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="success" />
        </div>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center text-muted my-5">
          <FaBox size={40} />
          <p className="mt-2">No matching orders found.</p>
        </div>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-dark text-center">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Products</th>
              <th>Total</th>
              <th>Delivery</th>
              <th>Address</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-center align-middle">
            {filteredOrders.map((order, idx) => (
              <tr key={order._id}>
                <td>{idx + 1}</td>
                <td>
                  <FaUser className="me-1 text-primary" />
                  {order.user?.name}
                </td>
                <td className="text-start">
                  <ol className="mb-0 ps-3">
                    {order.products.map((p, i) => (
                      <li key={i}>{p.name} × {p.quantity}</li>
                    ))}
                  </ol>
                </td>
                <td>₹{order.totalAmount}</td>
                <td>₹{order.deliveryCharge}</td>
                <td className="text-start">
                  <FaMapMarkerAlt className="me-1 text-danger" />
                  {order.address}
                </td>
                <td>
                  <FaCalendarAlt className="me-1 text-secondary" />
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <Form.Select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
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
                    className="mt-2 text-uppercase"
                  >
                    {order.status}
                  </Badge>
                </td>
                <td>
                  <div className="d-flex gap-2 justify-content-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleDownloadInvoice(order)}
                    >
                      <FaFileInvoice />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => openModal(order._id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Delete Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this order? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete Order
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminOrders;
