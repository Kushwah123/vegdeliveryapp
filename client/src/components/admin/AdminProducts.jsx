// frontend/src/components/admin/AdminProducts.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  deleteProduct,
  createProduct,
  updateProduct
} from '../../features/productSlice';
import {
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Alert
} from 'react-bootstrap';

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', category: '', description: '', image: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleClose = () => {
    setShow(false);
    setForm({ name: '', price: '', category: '', description: '', image: '' });
    setEditMode(false);
  };

  const handleShow = (product = null) => {
    if (product) {
      setEditMode(true);
      setEditId(product._id);
      setForm(product);
    }
    setShow(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      dispatch(updateProduct({ id: editId, data: form })).then(() => handleClose());
    } else {
      dispatch(createProduct(form)).then(() => handleClose());
    }
  };
  
  return (
    <>
      <Button variant="success" className="mb-3" onClick={() => handleShow()}>
        Add New Product
      </Button>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>₹{product.price}</td>
              <td>{product.category}</td>
              <td>{product.description}</td>
              <td>
                <img src={product.image} alt={product.name} width="60" height="40" style={{ objectFit: 'cover' }} />
              </td>
              <td>
                <Button size="sm" variant="warning" onClick={() => handleShow(product)} className="me-2">
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => dispatch(deleteProduct(product._id))}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Product' : 'Add Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Price</Form.Label>
              <Form.Control name="price" type="number" value={form.price} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Category</Form.Label>
              <Form.Control name="category" value={form.category} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control name="description" value={form.description} onChange={handleChange} as="textarea" rows={2} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Image URL</Form.Label>
              <Form.Control name="image" value={form.image} onChange={handleChange} required />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">
              {editMode ? 'Update' : 'Create'} Product
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default AdminProducts;