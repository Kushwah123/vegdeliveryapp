import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/productSlice';
import ProductCard from '../components/ProductCard';
import {
  Row,
  Col,
  Form,
  Container,
  Card,
  InputGroup
} from 'react-bootstrap';
import { BsWhatsapp } from 'react-icons/bs';
import Slider from '../components/Slider';
const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const { items } = useSelector((state) => state.cart);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter ? p.category === categoryFilter : true)
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.price - b.price;
      if (sortOrder === 'desc') return b.price - a.price;
      return 0;
    });

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>

      {/* ✅ Top Offer Banner */}
      <div style={{
        backgroundColor: '#ffefc0',
        padding: '10px 0',
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#a0522d',
        fontSize: '16px',
        borderBottom: '1px solid #e5c07b'
      }}>
        🎉 आज की डील: ₹50 की छूट सभी ऑर्डर पर! 🛒 <span style={{ color: '#dc3545' }}>केवल आज के लिए</span>
      </div>
      
      {/* 🔶 Top Hero Header */}
      <section className="bg-white py-4 border-bottom shadow-sm mb-4">
        <Container className="d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h2 className="fw-bold text-success mb-0">Your Online Vegetable Supermarket</h2>
            <p className="text-muted">Fresh produce delivered to your door</p>
          </div>
        </Container>
      </section>

      <Container fluid className="px-md-5">
        <Row>
          {/* 🔹 Sidebar Filter */}
          <Col md={3} className="mb-4">
            <div className="position-sticky" style={{ top: '100px' }}>
              <Card className="mb-3 shadow-sm border-0">
                <Card.Header className="bg-success text-white fw-semibold">
                  🔍 Search
                </Card.Header>
                <Card.Body>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Search by name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Card.Body>
              </Card>

              <Card className="mb-3 shadow-sm border-0">
                <Card.Header className="bg-success text-white fw-semibold">
                  🧾 Category
                </Card.Header>
                <Card.Body>
                  <Form.Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Form.Select>
                </Card.Body>
              </Card>

              <Card className="shadow-sm border-0">
                <Card.Header className="bg-success text-white fw-semibold">
                  💲 Sort by Price
                </Card.Header>
                <Card.Body>
                  <Form.Select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="">Default</option>
                    <option value="asc">Low to High</option>
                    <option value="desc">High to Low</option>
                  </Form.Select>
                </Card.Body>
              </Card>
            </div>
          </Col>

          {/* 🔹 Product Listing */}
          <Col md={9}>
            <Row>
              {loading ? (
                <p className="text-center text-muted">Loading products...</p>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Col key={product._id} xs={12} sm={6} md={4} className="mb-4">
                    <ProductCard product={product} />
                  </Col>
                ))
              ) : (
                <p className="text-center text-danger">No products found.</p>
              )}
            </Row>
          </Col>
        </Row>
      </Container>

      {/* ✅ Floating WhatsApp Button */}
      <a
        href="https://wa.me/918384895054?text=Hello%2C%20I%20need%20help%20regarding%20my%20order."
        className="whatsapp-help-btn"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#25D366',
          color: 'white',
          borderRadius: '50%',
          padding: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          zIndex: 999
        }}
      >
        <BsWhatsapp size={36} />
      </a>
    </div>
  );
};

export default Home;
