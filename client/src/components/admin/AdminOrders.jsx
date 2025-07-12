import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllOrders,
  updateOrderStatus,
  deleteOrderById,
  verifyPaymentStatus,
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
  Image,
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
import autoTable from 'jspdf-autotable';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const { users } = useSelector((state) => state.auth);
  const { products } = useSelector((state) => state.products);
console.log(orders);
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

  const handleVerifyPayment = (orderId, value) => {
    dispatch(verifyPaymentStatus({ orderId, paymentVerified: value }));
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

  const filteredOrders = (orders?.orders || [])
    .filter((order) =>
      statusFilter === 'all' ? true : order.status === statusFilter
    )
    .filter(
      (order) =>
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
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

    autoTable(doc, {
      head: [['#', 'User', 'Products', 'Total', 'Delivery', 'Status', 'Address']],
      body: rows,
      startY: 15,
    });

    doc.save('all_orders.pdf');
  };

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

    autoTable(doc, {
      startY: 50,
      head: [['#', 'Product', 'Qty', 'Price', 'Total']],
      body: productsData,
    });

    const finalY = doc.lastAutoTable.finalY || 70;
    doc.text(`Total Amount: ₹${order.totalAmount}`, 14, finalY + 10);
    doc.text(`Delivery Charge: ₹${order.deliveryCharge}`, 14, finalY + 20);
    doc.text('GST (0%): ₹0', 14, finalY + 30);
    doc.save(`invoice_${order._id}.pdf`);
  };

  const getImageUrl = (screenshotPath) => {
  if (!screenshotPath) return null;
  return `http://localhost:5000/${screenshotPath.replace(/\\/g, '/')}`;
};
console.log(getImageUrl)

  return (
    <Container className="mt-4">
      <h3 className="mb-3 text-success">📦 Manage All Orders</h3>

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
              <th>Payment</th>
              <th>QR Screenshot</th>
              <th>Address</th>
              <th>Date</th>
              <th>Status</th>
              <th>Slot</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center align-middle">
            {filteredOrders.map((order, idx) => (
              <tr key={order._id}>
                <td>{idx + 1}</td>
                <td>{order.user?.name || 'N/A'}</td>
                <td className="text-start">
                  <ol className="mb-0 ps-3">
                    {order.products.map((p, i) => (
                      <li key={i}>{p.name} × {p.quantity}</li>
                    ))}
                  </ol>
                </td>
                <td>₹{order.totalAmount}</td>
                <td>₹{order.deliveryCharge}</td>
                <td>
                  {order.paymentMethod}
                  {order.paymentMethod === 'Online' && (
                    <>
                      <Form.Select
                        size="sm"
                        className="mt-2"
                        value={order.paymentVerified || 'pending'}
                        onChange={(e) =>
                          handleVerifyPayment(order._id, e.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                      </Form.Select>
                      <Badge
                        bg={
                          order.paymentVerified === 'verified'
                            ? 'success'
                            : order.paymentVerified === 'rejected'
                            ? 'danger'
                            : 'warning'
                        }
                        className="mt-1 text-uppercase"
                      >
                        {order.paymentVerified || 'pending'}
                      </Badge>
                    </>
                  )}
                </td>
                <td>
  {order.paymentScreenshot ? (
    <Image
      src={getImageUrl(order.paymentScreenshot)}
      alt="QR"
      fluid
      rounded
      style={{
        width: '100px',
        height: '100px',
        objectFit: 'cover',
        border: '1px solid #ccc',
      }}
    />
  ) : (
    '—'
  )}
</td>

                <td>{order.address}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
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
                </td>
                <td>
  <Badge bg="info">
    {order.deliverySlot || '—'}
  </Badge>
</td>

                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleDownloadInvoice(order)}
                  >
                    <FaFileInvoice />
                  </Button>{' '}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => openModal(order._id)}
                  >
                    <FaTrash />
                  </Button>
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
